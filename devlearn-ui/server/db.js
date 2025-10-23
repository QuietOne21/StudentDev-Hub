// db.js — Integrated (Windows) auth via msnodesqlv8 with explicit ODBC driver
import sql from "mssql/msnodesqlv8.js";

const DRIVER = "{ODBC Driver 17 for SQL Server}"; // or "{ODBC Driver 17 for SQL Server}" if that's what you have

const config = {
  // Explicit connection string avoids opaque [object Object] errors
  connectionString: `Driver=${DRIVER};Server=localhost,1433;Database=StudentDevPortal;Trusted_Connection=Yes;Encrypt=Yes;TrustServerCertificate=Yes;`
  // Notes:
  // - Trusted_Connection=Yes  -> Windows auth
  // - Encrypt=Yes + TrustServerCertificate=Yes -> matches your local SQL TLS settings
};

let poolPromise;
export function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log("✅ Connected (Integrated) via", DRIVER);
        return pool;
      })
      .catch(err => {
        console.error("❌ SQL connection error details:", {
          message: err?.message,
          code: err?.code,
          original: err?.originalError?.message ?? err?.originalError,
          stack: err?.stack
        });
        throw err;
      });
  }
  return poolPromise;
}

export { sql };
