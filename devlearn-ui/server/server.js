import 'dotenv/config';
import "dotenv/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { registerAuthRoutes } from "./auth.js";
import { getPool } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT = "http://localhost:5173"; // your Vite dev server

app.use(cors({ origin: CLIENT, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query("SELECT 1 AS ok");
    return res.json({ ok: r.recordset?.[0]?.ok === 1 });
  } catch (e) {
    // serialize thoroughly
    const safe = (v) => {
      try { return JSON.stringify(v, Object.getOwnPropertyNames(v)); }
      catch { return String(v); }
    };
    return res.status(500).json({
      ok: false,
      error: e?.message || String(e),
      name: e?.name,
      code: e?.code,
      stack: e?.stack,
      original: e?.originalError ? safe(e.originalError) : undefined,
      full: safe(e)
    });
  }
});




// Auth
registerAuthRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
