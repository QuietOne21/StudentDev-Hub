// resources.js - Complete fixed version
import path from "node:path";
import fs from "node:fs/promises";
import multer from "multer";
import express from "express";
import { getPool } from "./db.js";
import { requireAuth, requireRole } from "./authMiddleware.js";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "resources");

// Create upload directory if it doesn't exist
try {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
  console.log(`📁 Upload directory created: ${UPLOAD_ROOT}`);
} catch (err) {
  console.log("Upload directory already exists or couldn't be created");
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    console.log(`📁 Destination: ${UPLOAD_ROOT}`);
    cb(null, UPLOAD_ROOT);
  },
  filename: (req, file, cb) => {
    const userId = req?.user?.id ?? "anon";
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    const filename = `${userId}_${Date.now()}_${safe}`;
    console.log(`📄 File upload: ${file.originalname} -> ${filename}`);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain'
  ];
  
  const allowedExtensions = /\.(pdf|doc|docx|ppt|pptx|xls|xlsx|jpg|jpeg|png|gif|webp|txt)$/i;
  
  const isMimeValid = allowedMimes.includes(file.mimetype);
  const isNameValid = allowedExtensions.test(file.originalname);
  
  console.log(`🔍 File validation:`, {
    name: file.originalname,
    mimetype: file.mimetype,
    mimeValid: isMimeValid,
    nameValid: isNameValid
  });
  
  if (isMimeValid && isNameValid) {
    cb(null, true);
  } else {
    const error = new Error(`Invalid file type: ${file.mimetype}. Allowed: PDF, Word, Excel, PowerPoint, Images`);
    console.log(`❌ File rejected: ${file.originalname} (${file.mimetype})`);
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10 MB
  },
});

export function registerResourceRoutes(app) {
  console.log('📚 Registering resource routes...');

  // GET /api/resources - Get all resources
  app.get("/api/resources", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const [rows] = await pool.execute(
        `SELECT r.*, u.name as creator_name 
         FROM resources r 
         LEFT JOIN users u ON r.created_by = u.id 
         ORDER BY r.id DESC`
      );
      
      console.log(`📦 Retrieved ${rows.length} resources for user ${req.user.id}`);
      res.json(rows || []);
    } catch (e) {
      console.error("❌ Resources list error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // GET /api/resources/:id - Get single resource
  app.get("/api/resources/:id", requireAuth, async (req, res) => {
    try {
      const resourceId = Number(req.params.id);
      const pool = await getPool();

      const [resources] = await pool.execute(
        `SELECT r.*, u.name as creator_name 
         FROM resources r 
         LEFT JOIN users u ON r.created_by = u.id 
         WHERE r.id = ?`,
        [resourceId]
      );

      if (resources.length === 0) {
        return res.status(404).json({ error: "Resource not found" });
      }

      res.json(resources[0]);
    } catch (e) {
      console.error("❌ Get resource error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/resources - Add new resource
  app.post("/api/resources", requireAuth, async (req, res) => {
    try {
      const { title, type, name, content, url, description, level, duration, icon, color } = req.body;
      const userId = req.user.id;

      if (!name || !type) {
        return res.status(400).json({ error: "Name and type are required" });
      }

      const pool = await getPool();
      
      const [result] = await pool.execute(
        `INSERT INTO resources 
         (title, type, name, content, url, description, level, duration, icon, color, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title || '',
          type,
          name,
          content || null,
          url || null,
          description || null,
          level || 'beginner',
          duration || null,
          icon || 'file',
          color || '#ccc',
          userId
        ]
      );

      const [newResource] = await pool.execute(
        `SELECT r.*, u.name as creator_name 
         FROM resources r 
         LEFT JOIN users u ON r.created_by = u.id 
         WHERE r.id = ?`,
        [result.insertId]
      );

      console.log(`✅ Resource created: ${name} by user ${userId}`);
      res.status(201).json(newResource[0] || {});
    } catch (e) {
      console.error("❌ Add resource error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/resources/upload - Upload document file with improved error handling
  app.post(
    "/api/resources/upload",
    requireAuth,
    (req, res, next) => {
      console.log('📤 Upload request received');
      next();
    },
    upload.single("file"),
    (err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File too large',
            message: `File size must be less than ${process.env.MAX_FILE_SIZE || 10 * 1024 * 1024} bytes`
          });
        }
        return res.status(400).json({ 
          error: 'Upload error',
          message: err.message 
        });
      } else if (err) {
        return res.status(400).json({ 
          error: 'File rejected',
          message: err.message 
        });
      }
      next();
    },
    async (req, res) => {
      try {
        console.log('📦 Processing upload...', {
          file: req.file ? {
            originalname: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
          } : 'No file',
          body: req.body
        });
        
        if (!req.file) {
          console.log('❌ No file uploaded');
          return res.status(400).json({ 
            error: "No file uploaded",
            message: "Please select a file to upload"
          });
        }

        const { title, description, level = 'beginner' } = req.body;
        const userId = req.user.id;

        console.log(`📄 Processing file: ${req.file.originalname} for user ${userId}`);

        const pool = await getPool();
        
        // Insert into resources table as document type
        const [result] = await pool.execute(
          `INSERT INTO resources 
           (title, type, name, content, url, description, level, created_by) 
           VALUES (?, 'document', ?, ?, ?, ?, ?, ?)`,
          [
            title || req.file.originalname.replace(/\.[^/.]+$/, ""),
            req.file.originalname,
            req.file.filename,
            `/uploads/resources/${req.file.filename}`,
            description || `Uploaded document: ${req.file.originalname}`,
            level,
            userId
          ]
        );

        console.log(`✅ Database record created with ID: ${result.insertId}`);

        const [newResource] = await pool.execute(
          "SELECT r.*, u.name as creator_name FROM resources r LEFT JOIN users u ON r.created_by = u.id WHERE r.id = ?",
          [result.insertId]
        );

        console.log(`✅ File uploaded successfully: ${req.file.originalname} as resource ID ${result.insertId}`);
        
        res.status(201).json({
          ...newResource[0],
          message: "File uploaded successfully"
        });
      } catch (error) {
        console.error("❌ Upload processing error:", error);
        
        // Clean up uploaded file if DB insert failed
        if (req.file) {
          try {
            await fs.unlink(req.file.path);
            console.log(`🧹 Cleaned up failed upload: ${req.file.path}`);
          } catch (cleanupErr) {
            console.error("File cleanup error:", cleanupErr);
          }
        }
        
        // Provide specific error messages
        let errorMessage = "Upload failed";
        if (error.code === 'ER_NO_SUCH_TABLE') {
          errorMessage = "Database table missing. Please check your database setup.";
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
          errorMessage = "Database access denied.";
        } else if (error.code === 'ECONNREFUSED') {
          errorMessage = "Cannot connect to database.";
        }
        
        res.status(500).json({ 
          error: errorMessage,
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  );

  // DELETE /api/resources/:id
  app.delete("/api/resources/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const id = Number(req.params.id);
      const pool = await getPool();

      // Get resource info for file deletion
      const [resources] = await pool.execute(
        "SELECT content, created_by FROM resources WHERE id = ?",
        [id]
      );

      if (resources.length === 0) {
        return res.status(404).json({ error: "Resource not found" });
      }

      const resource = resources[0];

      // Check ownership or admin role
      if (resource.created_by !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      // Delete from database
      await pool.execute(
        "DELETE FROM resources WHERE id = ?",
        [id]
      );

      // Also remove from saved_resources and reviews
      await pool.execute("DELETE FROM saved_resources WHERE resource_id = ?", [id]);
      await pool.execute("DELETE FROM reviews WHERE resource_id = ?", [id]);

      // Try to remove the uploaded file (best-effort)
      if (resource.content) {
        try {
          const filePath = path.join(UPLOAD_ROOT, resource.content);
          await fs.unlink(filePath);
          console.log(`🗑️ Deleted file: ${filePath}`);
        } catch (err) {
          console.log("⚠️ File deletion failed, continuing...");
        }
      }

      console.log(`✅ Resource deleted: ${id} by user ${userId}`);
      res.json({ ok: true, message: "Resource deleted successfully" });
    } catch (e) {
      console.error("❌ Resource delete error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // PATCH /api/resources/:id - Update resource
  app.patch("/api/resources/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const resourceId = Number(req.params.id);
      const { title, name, description, level, duration } = req.body || {};
      const pool = await getPool();

      // Check ownership
      const [resources] = await pool.execute(
        "SELECT id, created_by FROM resources WHERE id = ?",
        [resourceId]
      );

      if (resources.length === 0) {
        return res.status(404).json({ error: "Resource not found" });
      }

      const resource = resources[0];
      if (resource.created_by !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      // Build dynamic update query
      const updates = [];
      const params = [];
      
      if (title !== undefined) {
        updates.push("title = ?");
        params.push(title);
      }
      if (name !== undefined) {
        updates.push("name = ?");
        params.push(name);
      }
      if (description !== undefined) {
        updates.push("description = ?");
        params.push(description);
      }
      if (level !== undefined) {
        updates.push("level = ?");
        params.push(level);
      }
      if (duration !== undefined) {
        updates.push("duration = ?");
        params.push(duration);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      params.push(resourceId);

      await pool.execute(
        `UPDATE resources 
         SET ${updates.join(", ")} 
         WHERE id = ?`,
        params
      );

      // Get updated resource
      const [updatedResource] = await pool.execute(
        "SELECT * FROM resources WHERE id = ?",
        [resourceId]
      );

      console.log(`✅ Resource updated: ${resourceId} by user ${userId}`);
      res.json(updatedResource[0] || {});
    } catch (e) {
      console.error("❌ Update resource error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });

  // SAVED RESOURCES ENDPOINTS

  // GET /api/resources/saved - Get user's saved resources
  app.get("/api/resources/saved", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pool = await getPool();

      const [rows] = await pool.execute(
        `SELECT r.*, sr.saved_at 
         FROM saved_resources sr 
         JOIN resources r ON sr.resource_id = r.id 
         WHERE sr.user_id = ? 
         ORDER BY sr.saved_at DESC`,
        [userId]
      );

      console.log(`📚 Retrieved ${rows.length} saved resources for user ${userId}`);
      res.json(rows || []);
    } catch (e) {
      console.error("❌ Saved resources error:", e);
      
      // If table doesn't exist, return empty array instead of error
      if (e.code === 'ER_NO_SUCH_TABLE') {
        console.log('⚠️ saved_resources table does not exist, returning empty array');
        return res.json([]);
      }
      
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/resources/:id/save - Save resource
  app.post("/api/resources/:id/save", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const resourceId = Number(req.params.id);
      const pool = await getPool();

      // Check if resource exists
      const [resources] = await pool.execute(
        "SELECT id FROM resources WHERE id = ?",
        [resourceId]
      );

      if (resources.length === 0) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // Check if already saved
      const [existing] = await pool.execute(
        "SELECT id FROM saved_resources WHERE user_id = ? AND resource_id = ?",
        [userId, resourceId]
      );

      if (existing.length > 0) {
        return res.status(409).json({ error: "Resource already saved" });
      }

      // Save resource
      await pool.execute(
        "INSERT INTO saved_resources (user_id, resource_id, saved_at) VALUES (?, ?, NOW())",
        [userId, resourceId]
      );

      console.log(`🔖 Resource saved: ${resourceId} by user ${userId}`);
      res.json({ ok: true, message: "Resource saved successfully", saved: true });
    } catch (e) {
      console.error("❌ Save resource error:", e);
      
      // Handle missing table gracefully
      if (e.code === 'ER_NO_SUCH_TABLE') {
        return res.status(501).json({ error: "Saved resources feature not implemented yet" });
      }
      
      res.status(500).json({ error: "Server error" });
    }
  });

  // DELETE /api/resources/:id/unsave - Unsave resource
  app.delete("/api/resources/:id/unsave", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const resourceId = Number(req.params.id);
      const pool = await getPool();

      const [result] = await pool.execute(
        "DELETE FROM saved_resources WHERE user_id = ? AND resource_id = ?",
        [userId, resourceId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Saved resource not found" });
      }

      console.log(`🔖 Resource unsaved: ${resourceId} by user ${userId}`);
      res.json({ ok: true, message: "Resource removed from saved list", saved: false });
    } catch (e) {
      console.error("❌ Unsave resource error:", e);
      
      if (e.code === 'ER_NO_SUCH_TABLE') {
        return res.status(501).json({ error: "Saved resources feature not implemented yet" });
      }
      
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/resources/toggle-saved - Toggle save state
  app.post("/api/resources/toggle-saved", requireAuth, async (req, res) => {
    try {
      const { resource_id } = req.body;
      const userId = req.user.id;
      
      if (!resource_id) {
        return res.status(400).json({ error: "Resource ID is required" });
      }

      const pool = await getPool();

      // Check if already saved
      const [existing] = await pool.execute(
        "SELECT id FROM saved_resources WHERE user_id = ? AND resource_id = ?",
        [userId, resource_id]
      );

      if (existing.length > 0) {
        // Unsave
        await pool.execute(
          "DELETE FROM saved_resources WHERE user_id = ? AND resource_id = ?",
          [userId, resource_id]
        );
        console.log(`🔖 Resource toggled unsaved: ${resource_id} by user ${userId}`);
        return res.json({ ok: true, saved: false, message: "Resource unsaved" });
      } else {
        // Save
        await pool.execute(
          "INSERT INTO saved_resources (user_id, resource_id, saved_at) VALUES (?, ?, NOW())",
          [userId, resource_id]
        );
        console.log(`🔖 Resource toggled saved: ${resource_id} by user ${userId}`);
        return res.json({ ok: true, saved: true, message: "Resource saved" });
      }
    } catch (e) {
      console.error("❌ Toggle saved error:", e);
      
      if (e.code === 'ER_NO_SUCH_TABLE') {
        return res.status(501).json({ error: "Saved resources feature not implemented yet" });
      }
      
      res.status(500).json({ error: "Server error" });
    }
  });

  // REVIEWS ENDPOINTS

  // GET /api/resources/:id/reviews - Get reviews for a resource
  app.get("/api/resources/:id/reviews", requireAuth, async (req, res) => {
    try {
      const resourceId = Number(req.params.id);
      const pool = await getPool();

      const [reviews] = await pool.execute(
        `SELECT r.*, u.name as user_name 
         FROM reviews r 
         LEFT JOIN users u ON r.user_id = u.id 
         WHERE r.resource_id = ? 
         ORDER BY r.created_at DESC`,
        [resourceId]
      );

      // Format dates for frontend
      const formattedReviews = reviews.map(review => ({
        ...review,
        date: new Date(review.date || review.created_at).toLocaleDateString()
      }));

      console.log(`📝 Retrieved ${formattedReviews.length} reviews for resource ${resourceId}`);
      res.json(formattedReviews);
    } catch (e) {
      console.error("❌ Get reviews error:", e);
      
      // If table doesn't exist, return empty array
      if (e.code === 'ER_NO_SUCH_TABLE') {
        console.log('⚠️ reviews table does not exist, returning empty array');
        return res.json([]);
      }
      
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/resources/:id/reviews - Add review
  app.post("/api/resources/:id/reviews", requireAuth, async (req, res) => {
    try {
      const resourceId = Number(req.params.id);
      const { text, rating } = req.body;
      const userId = req.user.id;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Valid rating (1-5) is required" });
      }

      const pool = await getPool();

      // Check if resource exists
      const [resources] = await pool.execute(
        "SELECT id FROM resources WHERE id = ?",
        [resourceId]
      );

      if (resources.length === 0) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // Check if user already reviewed this resource
      const [existingReviews] = await pool.execute(
        "SELECT id FROM reviews WHERE user_id = ? AND resource_id = ?",
        [userId, resourceId]
      );

      if (existingReviews.length > 0) {
        return res.status(409).json({ error: "You have already reviewed this resource" });
      }

      // Add review
      const [result] = await pool.execute(
        `INSERT INTO reviews (user_id, resource_id, text, rating, date, created_at) 
         VALUES (?, ?, ?, ?, CURDATE(), NOW())`,
        [userId, resourceId, text || null, rating]
      );

      // Get the new review with user info
      const [newReview] = await pool.execute(
        `SELECT r.*, u.name as user_name 
         FROM reviews r 
         LEFT JOIN users u ON r.user_id = u.id 
         WHERE r.id = ?`,
        [result.insertId]
      );

      const formattedReview = {
        ...newReview[0],
        date: new Date(newReview[0].date || newReview[0].created_at).toLocaleDateString()
      };

      console.log(`⭐ Review added for resource ${resourceId} by user ${userId}`);
      res.status(201).json(formattedReview);
    } catch (e) {
      console.error("❌ Add review error:", e);
      
      if (e.code === 'ER_NO_SUCH_TABLE') {
        return res.status(501).json({ error: "Reviews feature not implemented yet" });
      }
      
      res.status(500).json({ error: "Server error" });
    }
  });

  // Serve uploaded files with authentication
  app.use("/uploads/resources", requireAuth, express.static(UPLOAD_ROOT));
  console.log('✅ Resource routes registered successfully');
}

