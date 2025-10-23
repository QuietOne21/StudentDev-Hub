// profile.js - Updated for bcryptjs
import { getPool } from "./db.js";
import { requireAuth } from "./authMiddleware.js";
import bcrypt from "bcryptjs"; // ← CHANGED TO bcryptjs
import multer from "multer";
import path from "node:path";
import fs from "node:fs/promises";

const uploadDir = path.join(process.cwd(), "uploads", "avatars");
// Create upload directory if it doesn't exist
try {
  await fs.mkdir(uploadDir, { recursive: true });
} catch (err) {
  console.log("Upload directory already exists");
}

const upload = multer({ dest: uploadDir });

export function registerProfileRoutes(app) {
  // GET profile
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pool = await getPool();
      
      const [rows] = await pool.execute(
        `SELECT u.id, u.name, u.email, u.role, u.avatar_url,
                p.theme, p.display_name
         FROM users u
         LEFT JOIN user_profiles p ON p.user_id = u.id
         WHERE u.id = ?`,
        [userId]
      );

      const row = rows[0];
      if (!row) return res.status(404).json({ error: "Profile not found" });

      return res.json({
        id: row.id,
        name: row.display_name || row.name,
        email: row.email,
        role: row.role,
        theme: row.theme || "dark",
        avatarUrl: row.avatar_url || ""
      });
    } catch (e) {
      console.error("GET /api/profile error", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/profile/password - Updated for bcryptjs
  app.post("/api/profile/password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Both currentPassword and newPassword are required" });
      }
      if (String(newPassword).length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters" });
      }

      const userId = req.user.id;
      const pool = await getPool();

      // grab existing hash
      const [users] = await pool.execute(
        "SELECT password_hash FROM users WHERE id = ?",
        [userId]
      );

      const user = users[0];
      if (!user) return res.status(404).json({ error: "User not found" });

      const matches = await bcrypt.compare(currentPassword, user.password_hash || "");
      if (!matches) return res.status(401).json({ error: "Current password is incorrect" });

      const newHash = await bcrypt.hash(newPassword, 10);
      await pool.execute(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [newHash, userId]
      );

      return res.json({ ok: true });
    } catch (e) {
      console.error("POST /api/profile/password error", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ... rest of your profile routes remain the same
  // POST /api/profile/avatar
  app.post("/api/profile/avatar", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file" });
      const userId = req.user.id;

      // optionally rename file to keep ext
      const ext = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
      const finalName = `${userId}_${Date.now()}${ext}`;
      const finalPath = path.join(uploadDir, finalName);
      await fs.rename(req.file.path, finalPath);

      // public URL (served by express.static in /uploads)
      const avatarUrl = `/uploads/avatars/${finalName}`;

      const pool = await getPool();
      await pool.execute(
        "UPDATE users SET avatar_url = ? WHERE id = ?",
        [avatarUrl, userId]
      );

      return res.json({ avatarUrl });
    } catch (e) {
      console.error("avatar upload error", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // PATCH /api/profile
  app.patch("/api/profile", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body || {};
    try {
      const pool = await getPool();

      // Update display name in user_profiles
      if (name != null) {
        await pool.execute(
          `INSERT INTO user_profiles (user_id, display_name, theme, updated_at) 
           VALUES (?, ?, 'dark', NOW()) 
           ON DUPLICATE KEY UPDATE 
             display_name = ?, updated_at = NOW()`,
          [userId, name, name]
        );
      }

      // Update email in users table if provided
      if (email != null) {
        const newEmail = (email || "").trim();
        if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
          // Check for duplicate email
          const [duplicate] = await pool.execute(
            "SELECT id FROM users WHERE email = ? AND id <> ?",
            [newEmail, userId]
          );

          if (duplicate.length === 0) {
            await pool.execute(
              "UPDATE users SET email = ? WHERE id = ?",
              [newEmail, userId]
            );
          }
          // If duplicate exists, we just skip the email update
        }
      }

      // Return merged snapshot
      const [rows] = await pool.execute(
        `SELECT u.id, u.name, u.email, u.role, u.avatar_url,
                p.theme, p.display_name
         FROM users u
         LEFT JOIN user_profiles p ON p.user_id = u.id
         WHERE u.id = ?`,
        [userId]
      );

      const row = rows[0] || {};
      return res.json({
        id: row.id,
        name: row.display_name || row.name,
        email: row.email,
        role: row.role,
        theme: row.theme || "dark",
        avatarUrl: row.avatar_url || ""
      });
    } catch (e) {
      console.error("PATCH /api/profile error", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // DELETE /api/profile (delete account)
  app.delete("/api/profile", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const pool = await getPool();

    try {
      // Get avatar URL for cleanup
      const [users] = await pool.execute(
        "SELECT avatar_url FROM users WHERE id = ?",
        [userId]
      );
      const avatarUrl = users[0]?.avatar_url || "";

      // Get resource file paths for cleanup
      const [resources] = await pool.execute(
        "SELECT content FROM resources WHERE created_by = ?",
        [userId]
      );
      const resourceFiles = resources.map(r => r.content).filter(Boolean);

      // Start transaction
      await pool.execute("START TRANSACTION");

      try {
        // Delete user's data from related tables
        await pool.execute("DELETE FROM saved_resources WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM user_preferences WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM user_profiles WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM user_progress WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM user_stats_daily WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM notifications WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM eventregistrations WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM comment WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM forumpost WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM code_snippets WHERE lecturer_user_id = ?", [userId]);
        await pool.execute("DELETE FROM resources WHERE created_by = ?", [userId]);
        await pool.execute("DELETE FROM roadmaps WHERE user_id = ?", [userId]);
        
        // Finally delete the user
        await pool.execute("DELETE FROM users WHERE id = ?", [userId]);

        await pool.execute("COMMIT");

        // Best-effort file cleanup AFTER commit
        try {
          // Delete avatar file
          if (avatarUrl && avatarUrl.startsWith("/uploads/avatars/")) {
            const avatarPath = path.join(uploadDir, path.basename(avatarUrl));
            await fs.unlink(avatarPath).catch(() => {});
          }

          // Delete resource files
          for (const filename of resourceFiles) {
            try {
              const resourcePath = path.join(process.cwd(), "uploads", "resources", filename);
              await fs.unlink(resourcePath);
            } catch (err) {
              // Continue if file deletion fails
            }
          }
        } catch (fileErr) {
          console.log("File cleanup failed:", fileErr);
        }

        // Clear auth cookie
        res.clearCookie("auth", { 
          httpOnly: true, 
          sameSite: "lax", 
          secure: false,
          path: "/"
        });
        
        return res.json({ ok: true });
      } catch (err) {
        await pool.execute("ROLLBACK");
        throw err;
      }
    } catch (e) {
      console.error("DELETE /api/profile error", e);
      return res.status(500).json({ error: "Server error" });
    }
  });
}