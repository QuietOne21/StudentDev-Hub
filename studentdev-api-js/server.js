// server.js - Enhanced with Community & Pathways routes
import 'dotenv/config';
import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { registerAuthRoutes } from "./auth.js";
import { getPool } from "./db.js";
import { registerDashboardRoutes } from "./dashboard.js";
import { registerResourceRoutes } from "./resources.js";
import { registerProfileRoutes } from "./profile.js";
import { registerCommunityRoutes } from "./community.js";
import { registerPathwayRoutes } from "./pathways.js";
import { registerAIRoutes } from "./ai.js";

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT = process.env.CLIENT_URL || "http://localhost:5173";

// 1. CORS first
app.use(cors({ 
  origin: CLIENT, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// 2. Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. Static files (before API routes)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// 4. Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 5. Health check (before API routes)
app.get("/api/health", async (_req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute("SELECT 1 AS ok");
    
    const [userCount] = await pool.execute("SELECT COUNT(*) as count FROM users");
    const [resourceCount] = await pool.execute("SELECT COUNT(*) as count FROM resources");
    const [postCount] = await pool.execute("SELECT COUNT(*) as count FROM forumpost");
    const [pathwayCount] = await pool.execute("SELECT COUNT(*) as count FROM roadmaps WHERE is_active = 1");
    
    return res.json({ 
      ok: rows[0]?.ok === 1,
      database: 'connected',
      users: userCount[0]?.count || 0,
      resources: resourceCount[0]?.count || 0,
      forum_posts: postCount[0]?.count || 0,
      active_pathways: pathwayCount[0]?.count || 0,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (e) {
    console.error("Health check failed:", e);
    return res.status(503).json({
      ok: false,
      error: e?.message || 'Service unavailable',
      database: 'disconnected'
    });
  }
});

// 6. API info
app.get("/api", (_req, res) => {
  res.json({
    name: "StudentDev API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/*",
      dashboard: "/api/dashboard/*",
      resources: "/api/resources/*",
      profile: "/api/profile/*",
      community: "/api/community/*",
      pathways: "/api/pathways/*"
    },
    features: [
      "Authentication & Authorization",
      "User Profiles & Dashboard",
      "Learning Resources Management",
      "Community Forums & Events",
      "Learning Pathways & Progress Tracking"
    ]
  });
});

// 7. Register ALL API routes
console.log('🔄 Registering API routes...');
registerAuthRoutes(app);
registerDashboardRoutes(app);
registerResourceRoutes(app);
registerProfileRoutes(app);
registerCommunityRoutes(app);
registerPathwayRoutes(app);
registerAIRoutes(app);
console.log('✅ All API routes registered successfully');

// 8. API 404 handler - ONLY for API routes that start with /api
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      auth: [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/logout',
        '/api/auth/me'
      ],
      dashboard: [
        '/api/dashboard/summary',
        '/api/dashboard/stats',
        '/api/dashboard/activity'
      ],
      resources: [
        '/api/resources',
        '/api/resources/:id',
        '/api/resources/upload',
        '/api/resources/saved',
        '/api/resources/:id/save',
        '/api/resources/:id/reviews'
      ],
      profile: [
        '/api/profile',
        '/api/profile/preferences',
        '/api/profile/progress'
      ],
      community: [
        '/api/community/posts',
        '/api/community/posts/:id',
        '/api/community/posts/:id/comments',
        '/api/community/comments/:id',
        '/api/community/categories',
        '/api/community/events',
        '/api/community/events/:id',
        '/api/community/events/:id/registrations',
        '/api/community/stats'
      ],
      pathways: [
        '/api/pathways',
        '/api/pathways/:id',
        '/api/pathways/:pathwayId/levels/:levelId',
        '/api/pathways/progress',
        '/api/pathways/progress/:levelId',
        '/api/pathways/challenges/:challengeId/submit',
        '/api/pathways/challenges/:challengeId/hint',
        '/api/pathways/stats'
      ]
    }
  });
});

// 9. Global 404 handler - for all other routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    // This should have been caught by the API 404 handler above
    return res.status(404).json({ 
      error: 'API endpoint not found',
      path: req.originalUrl
    });
  }
  
  // For non-API routes (like serving frontend)
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    message: 'This is a backend API server. Please use the frontend application.'
  });
});

// 10. Global error handler - MUST be last
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id || 'unauthenticated',
    ip: req.ip
  });

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' });
  }

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ error: 'Referenced resource not found' });
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(500).json({ error: 'Database access denied' });
  }
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: 'Database connection refused' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Default error response
  const errorResponse = {
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      details: err.details
    })
  };

  res.status(500).json(errorResponse);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  
  try {
    // Close database connections
    const pool = await getPool();
    await pool.end();
    console.log('✅ Database connections closed');
    
    // Close server
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.log('⚠️ Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
    
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // For nodemon

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 StudentDev API Server Started!
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
🔗 CORS: ${CLIENT}
📁 Uploads: ${path.join(process.cwd(), 'uploads')}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
  
📊 Available Features:
   ✅ Authentication System
   ✅ User Dashboard
   ✅ Learning Resources
   ✅ User Profiles
   ✅ Community Forums
   ✅ Learning Pathways
   ✅ Progress Tracking
   ✅ File Uploads

🔍 Health Check: http://localhost:${PORT}/api/health
📚 API Documentation: http://localhost:${PORT}/api
  `);
});

export default app;