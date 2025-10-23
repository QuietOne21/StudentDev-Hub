// dashboard.js - Consolidated dashboard routes
import { getPool } from "./db.js";
import { requireAuth } from "./authMiddleware.js";

export function registerDashboardRoutes(app) {
  // GET /api/dashboard/summary - Main dashboard data
  app.get("/api/dashboard/summary", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pool = await getPool();

      // Get profile
      const [profileRows] = await pool.execute(
        `SELECT u.id, u.name, u.email, u.role, u.avatar_url,
                p.theme, p.display_name 
         FROM users u 
         LEFT JOIN user_profiles p ON p.user_id = u.id 
         WHERE u.id = ?`,
        [userId]
      );

      // Get progress
      const [progressRows] = await pool.execute(
        "SELECT overall_percent FROM user_progress WHERE user_id = ?",
        [userId]
      );

      // Get notifications
      const [notificationRows] = await pool.execute(
        `SELECT id, title, body, type, created_at, read_at, dismissed 
         FROM notifications 
         WHERE user_id = ? AND dismissed = 0 
         ORDER BY created_at DESC LIMIT 10`,
        [userId]
      );

      // Get recent resources
      const [resourceRows] = await pool.execute(
        `SELECT id, title, type, name, description, level 
         FROM resources 
         WHERE created_by = ? 
         ORDER BY id DESC LIMIT 10`,
        [userId]
      );

      // Get stats
      const [statsRows] = await pool.execute(
        `SELECT stat_date, time_spent_minutes, assignments_done, success_rate_pct, streak_days 
         FROM user_stats_daily 
         WHERE user_id = ? 
         ORDER BY stat_date DESC LIMIT 7`,
        [userId]
      );

      const profile = profileRows[0] || {};
      
      return res.json({
        profile: {
          id: profile.id,
          name: profile.display_name || profile.name,
          email: profile.email,
          role: profile.role,
          theme: profile.theme || "dark",
          avatarUrl: profile.avatar_url || null
        },
        progress: progressRows[0]?.overall_percent || 0,
        notifications: notificationRows || [],
        resources: resourceRows || [],
        stats: statsRows || []
      });

    } catch (e) {
      console.error("summary error", e);
      return res.status(500).json({ error: "Server error" });
    }
  });

   // GET /api/dashboard/pathway-progress - Get pathway progress for dashboard
app.get("/api/dashboard/pathway-stats", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pool = await getPool();

      // Get user's pathway progress
      const [pathwayStats] = await pool.execute(`
        SELECT 
          r.title as pathway_title,
          COUNT(DISTINCT lp.level_id) as completed_levels,
          COUNT(DISTINCT pl.level_id) as total_levels,
          COUNT(DISTINCT lp.challenge_id) as completed_challenges,
          (SELECT COUNT(*) FROM challenges c 
           JOIN pathway_levels pl2 ON c.level_id = pl2.level_id 
           WHERE pl2.roadmap_id = r.id) as total_challenges,
          MAX(lp.last_activity) as last_activity
        FROM roadmaps r
        LEFT JOIN pathway_levels pl ON r.id = pl.roadmap_id
        LEFT JOIN level_progress lp ON pl.level_id = lp.level_id AND lp.user_id = ?
        WHERE r.is_active = 1
        GROUP BY r.id, r.title
        ORDER BY last_activity DESC
      `, [userId]);

      // Calculate overall statistics
      const overallStats = pathwayStats.reduce((acc, stat) => ({
        completedLevels: acc.completedLevels + (stat.completed_levels || 0),
        totalLevels: acc.totalLevels + (stat.total_levels || 0),
        completedChallenges: acc.completedChallenges + (stat.completed_challenges || 0),
        totalChallenges: acc.totalChallenges + (stat.total_challenges || 0)
      }), { completedLevels: 0, totalLevels: 0, completedChallenges: 0, totalChallenges: 0 });

      const levelProgress = overallStats.totalLevels > 0 ? 
        (overallStats.completedLevels / overallStats.totalLevels) * 100 : 0;
      
      const challengeProgress = overallStats.totalChallenges > 0 ? 
        (overallStats.completedChallenges / overallStats.totalChallenges) * 100 : 0;
      
      const overallProgress = Math.round((levelProgress + challengeProgress) / 2);

      res.json({
        overallProgress,
        pathwayStats,
        summary: {
          activePathways: pathwayStats.length,
          completedLevels: overallStats.completedLevels,
          totalLevels: overallStats.totalLevels,
          completedChallenges: overallStats.completedChallenges,
          totalChallenges: overallStats.totalChallenges
        }
      });

    } catch (e) {
      console.error("Pathway stats error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });



  // GET /api/notifications - Get user notifications
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(
        `SELECT id, title, body, type, dismissed, created_at 
         FROM notifications 
         WHERE user_id = ? AND dismissed = 0 
         ORDER BY created_at DESC`,
        [req.user.id]
      );
      return res.json({ items: rows || [] });
    } catch (err) {
      console.error("GET /api/notifications", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // PATCH /api/notifications/:id/dismiss - Dismiss notification
  app.patch("/api/notifications/:id/dismiss", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: "Invalid id" });

      const pool = await getPool();
      const [result] = await pool.execute(
        `UPDATE notifications 
         SET dismissed = 1, read_at = COALESCE(read_at, NOW()) 
         WHERE id = ? AND user_id = ? AND dismissed = 0`,
        [id, req.user.id]
      );

      const affected = result.affectedRows;
      if (affected === 0) return res.status(404).json({ error: "Not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("PATCH /api/notifications/:id/dismiss", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/notifications/:id/read - Mark notification as read
  app.post("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const id = Number(req.params.id);
      const pool = await getPool();

      await pool.execute(
        `UPDATE notifications 
         SET read_at = COALESCE(read_at, NOW()) 
         WHERE id = ? AND user_id = ?`,
        [id, userId]
      );

      return res.json({ ok: true });
    } catch (e) {
      console.error("notif read error", e);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // GET /api/progress - Get user progress
  app.get("/api/progress", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(
        "SELECT overall_percent FROM user_progress WHERE user_id = ?",
        [req.user.id]
      );

      if (rows.length) {
        return res.json({ progress: Number(rows[0].overall_percent) });
      }

      // Create default record if missing
      const def = 72;
      await pool.execute(
        "INSERT INTO user_progress (user_id, overall_percent) VALUES (?, ?)",
        [req.user.id, def]
      );

      return res.json({ progress: def });
    } catch (err) {
      console.error("GET /api/progress", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // PATCH /api/progress - Update user progress
  app.patch("/api/progress", requireAuth, async (req, res) => {
    try {
      const value = Number(req.body?.progress);
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        return res.status(400).json({ error: "progress must be 0..100" });
      }
      
      const pool = await getPool();
      await pool.execute(
        `INSERT INTO user_progress (user_id, overall_percent) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE overall_percent = ?`,
        [req.user.id, value, value]
      );
      
      return res.json({ ok: true });
    } catch (err) {
      console.error("PATCH /api/progress", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // PATCH /api/profile - Update user profile
  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const { theme, name } = req.body || {};
      const userId = req.user.id;
      const pool = await getPool();

      // Upsert user profile
      const [result] = await pool.execute(
        `INSERT INTO user_profiles (user_id, display_name, theme, updated_at) 
         VALUES (?, ?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE 
           display_name = COALESCE(?, display_name), 
           theme = COALESCE(?, theme), 
           updated_at = NOW()`,
        [userId, name, theme || 'dark', name, theme]
      );

      // Get updated profile
      const [profileRows] = await pool.execute(
        "SELECT user_id, display_name, theme FROM user_profiles WHERE user_id = ?",
        [userId]
      );

      return res.json(profileRows[0] || {});
    } catch (e) {
      console.error("profile patch error", e);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // GET /api/dashboard/lecturer-overview - Lecturer-specific dashboard
  app.get("/api/dashboard/lecturer-overview", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pool = await getPool();

      // Ensure the caller is a lecturer/admin
      const [roleRows] = await pool.execute(
        "SELECT role FROM users WHERE id = ?",
        [userId]
      );

      const role = roleRows[0]?.role?.toLowerCase() || "student";
      if (role !== "lecturer" && role !== "admin") {
        return res.json({ activeUsers7d: 0, modulesCount: 0, snippetsCount: 0 });
      }

      // Active users in last 7 days (using forum activity as proxy)
      const [activeUsersResult] = await pool.execute(
        `SELECT COUNT(DISTINCT user_id) as active_users 
         FROM forumpost 
         WHERE user_id != ? 
         AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
        [userId]
      );

      // Modules count (using roadmaps as proxy for modules)
      const [modulesResult] = await pool.execute(
        "SELECT COUNT(*) as modules_count FROM roadmaps WHERE user_id = ? AND is_active = 1",
        [userId]
      );

      // Code snippets count
      const [snippetsResult] = await pool.execute(
        "SELECT COUNT(*) as snippets_count FROM code_snippets WHERE lecturer_user_id = ?",
        [userId]
      );

      const activeUsers7d = activeUsersResult[0]?.active_users || 0;
      const modulesCount = modulesResult[0]?.modules_count || 0;
      const snippetsCount = snippetsResult[0]?.snippets_count || 0;

      return res.json({
        activeUsers7d,
        modulesCount,
        snippetsCount,
      });
    } catch (e) {
      console.error("lecturer-overview error", e);
      return res.status(500).json({ error: "Server error" });
    }
  });
}