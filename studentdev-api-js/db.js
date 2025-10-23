// db.js - Enhanced with connection pooling and retry logic
import mysql from 'mysql2/promise';

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '@_Quiet1',
  database: process.env.DB_NAME || 'studentdev',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
 // acquireTimeout: 60000,
  //timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+00:00'
  // Enable for debugging
  // debug: process.env.NODE_ENV === 'development'
};

class DatabaseManager {
  constructor() {
    this.pool = null;
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async initialize() {
    try {
      this.pool = mysql.createPool(config);
      
      // Test connection
      const connection = await this.pool.getConnection();
      console.log('✅ Connected to MySQL database');
      connection.release();
      
      this.isConnected = true;
      this.retryCount = 0;
      
      // Set up pool event listeners
      this.pool.on('connection', (connection) => {
        console.log('🔗 New database connection established');
      });
      
      this.pool.on('acquire', (connection) => {
        // console.log('🔗 Connection acquired');
      });
      
      this.pool.on('release', (connection) => {
        // console.log('🔗 Connection released');
      });
      
      this.pool.on('enqueue', () => {
        console.log('⏳ Waiting for available database connection...');
      });
      
      return this.pool;
    } catch (error) {
      console.error('❌ Failed to connect to MySQL:', error.message);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`🔄 Retrying connection (${this.retryCount}/${this.maxRetries})...`);
        await this.delay(2000 * this.retryCount);
        return this.initialize();
      } else {
        throw new Error(`Failed to connect to database after ${this.maxRetries} attempts`);
      }
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getPool() {
    if (!this.pool || !this.isConnected) {
      return this.initialize();
    }
    
    // Verify connection is still alive
    try {
      const testConn = await this.pool.getConnection();
      testConn.release();
      return this.pool;
    } catch (error) {
      console.error('Connection verification failed, reinitializing...');
      this.isConnected = false;
      return this.initialize();
    }
  }

  async query(sql, params = []) {
    const pool = await this.getPool();
    try {
      const [rows, fields] = await pool.execute(sql, params);
      return { rows, fields, success: true };
    } catch (error) {
      console.error('Database query error:', {
        sql: sql.substring(0, 200) + (sql.length > 200 ? '...' : ''),
        params: params,
        error: error.message,
        code: error.code
      });
      throw error;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔌 Database connections closed');
      this.isConnected = false;
    }
  }
}

// Create singleton instance
const dbManager = new DatabaseManager();

// Export functions
export async function getPool() {
  return dbManager.getPool();
}

export async function query(sql, params = []) {
  return dbManager.query(sql, params);
}

export async function closeDatabase() {
  return dbManager.close();
}

// Export pool for direct access
export { dbManager };