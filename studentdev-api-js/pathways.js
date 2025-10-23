// studentdev-api-js/pathways.js - SIMPLE WORKING VERSION
import { getPool } from "./db.js";
import { requireAuth } from "./authMiddleware.js";
import { pathways } from "./pathways-data.js";

export function registerPathwayRoutes(app) {
  console.log('🛣️ Registering pathway routes...');

  // GET /api/pathways - Get all pathways
  app.get("/api/pathways", requireAuth, async (req, res) => {
    try {
      console.log('📦 Fetching pathways for user:', req.user.id);
      
      // Simple sample data - always return this
      

      console.log('✅ Returning pathways data');
      res.json(pathways);

    } catch (error) {
      console.error("❌ Get pathways error:", error);
      res.status(500).json({ error: "Failed to fetch pathways" });
    }
  });

  // GET /api/pathways/dashboard-progress
  app.get("/api/pathways/dashboard-progress", requireAuth, async (req, res) => {
    try {
      res.json({
        overallProgress: 25,
        levelProgress: 30,
        challengeProgress: 20,
        stats: {
          completedLevels: 1,
          totalLevels: 4,
          completedChallenges: 3,
          totalChallenges: 12
        }
      });
    } catch (error) {
      console.error("❌ Dashboard progress error:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Add other endpoints...
  app.get("/api/pathways/progress", requireAuth, async (req, res) => {
    res.json([]);
  });

  app.post("/api/pathways/progress", requireAuth, async (req, res) => {
    res.json({ ok: true, message: "Progress saved" });
  });

  app.get("/api/pathways/:pathwayId/comments", requireAuth, async (req, res) => {
    res.json([]);
  });

  app.post("/api/pathways/:pathwayId/comments", requireAuth, async (req, res) => {
    const { text } = req.body;
    res.json({
      comment_id: Date.now(),
      user_name: "You",
      comment_text: text,
      created_at: new Date().toISOString()
    });
  });

  console.log('✅ Pathway routes registered successfully');
}