import express from "express";
import { getPool } from "./db.js";
import { requireAuth, requireRole } from "./authMiddleware.js";

export function registerCommunityRoutes(app) {
  console.log('💬 Registering community routes...');

  // FORUM POSTS ENDPOINTS

  // GET /api/community/posts - Get all forum posts with pagination and filtering
  app.get("/api/community/posts", requireAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const category = req.query.category;
      const search = req.query.search;

      console.log('📝 Request params:', { page, limit, offset, category, search });

      const pool = await getPool();
      
      // Simplified approach - build the complete query as one string
      let baseQuery = `SELECT fp.PostID as id, fp.UserID, u.name as author_name, fp.TopicCategory as category, fp.Title as title, fp.Content as content, fp.Timestamp as created_at, (SELECT COUNT(*) FROM comment c WHERE c.PostID = fp.PostID) as comment_count FROM forumpost fp JOIN users u ON fp.UserID = u.id`;
      
      let countQuery = `SELECT COUNT(*) as total FROM forumpost fp JOIN users u ON fp.UserID = u.id`;
      
      const params = [];
      const countParams = [];
      let whereClause = '';

      // Build WHERE conditions
      const conditions = [];
      
      if (category && category !== 'all') {
        conditions.push("fp.TopicCategory = ?");
        params.push(category);
        countParams.push(category);
      }

      if (search && search.trim()) {
        conditions.push("(fp.Title LIKE ? OR fp.Content LIKE ? OR u.name LIKE ?)");
        const searchTerm = `%${search.trim()}%`;
        params.push(searchTerm, searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        whereClause = ` WHERE ${conditions.join(' AND ')}`;
      }

      // Complete the queries
      const finalQuery = baseQuery + whereClause + ` ORDER BY fp.Timestamp DESC LIMIT ${limit} OFFSET ${offset}`;
      const finalCountQuery = countQuery + whereClause;

      console.log('📝 Final query:', finalQuery);
      console.log('📝 Parameters:', params);
      console.log('📝 Count query:', finalCountQuery);
      console.log('📝 Count parameters:', countParams);

      // Execute queries without additional parameters for LIMIT/OFFSET since they're in the string
      const [posts] = await pool.execute(finalQuery, params);
      const [[countResult]] = await pool.execute(finalCountQuery, countParams);
      
      console.log(`📝 Retrieved ${posts.length} forum posts for user ${req.user.id}`);
      console.log('📝 First post sample:', posts[0]);
      console.log('📝 Total count:', countResult.total);
      
      res.json({
        posts,
        totalPosts: countResult.total,
        totalPages: Math.ceil(countResult.total / limit),
        currentPage: page
      });
    } catch (e) {
      console.error("❌ Get forum posts error:", e);
      res.status(500).json({ error: "Failed to fetch forum posts", details: e.message });
    }
  });

  // GET /api/community/posts/:id - Get single post with comments
  app.get("/api/community/posts/:id", requireAuth, async (req, res) => {
    try {
      const postId = Number(req.params.id);
      const pool = await getPool();

      // Get post details
      const [posts] = await pool.execute(
        `SELECT 
          fp.PostID as id,
          fp.UserID,
          u.name as author_name,
          fp.TopicCategory as category,
          fp.Title as title,
          fp.Content as content,
          fp.Timestamp as created_at
         FROM forumpost fp
         JOIN users u ON fp.UserID = u.id
         WHERE fp.PostID = ?`,
        [postId]
      );

      if (posts.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Get comments for this post
      const [comments] = await pool.execute(
        `SELECT 
          c.CommentID as id,
          c.UserID,
          u.name as author_name,
          c.Content as content,
          c.Timestamp as created_at
         FROM comment c
         JOIN users u ON c.UserID = u.id
         WHERE c.PostID = ?
         ORDER BY c.Timestamp ASC`,
        [postId]
      );

      const post = {
        ...posts[0],
        comments: comments || [],
        comment_count: comments.length
      };

      console.log(`📖 Retrieved post ${postId} with ${comments.length} comments`);
      res.json(post);
    } catch (e) {
      console.error("❌ Get post error:", e);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // POST /api/community/posts - Create new forum post
  app.post("/api/community/posts", requireAuth, async (req, res) => {
    try {
      const { title, content, category = 'General' } = req.body;
      const userId = req.user.id;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      const pool = await getPool();
      
      const [result] = await pool.execute(
        `INSERT INTO forumpost (UserID, TopicCategory, Title, Content, Timestamp) 
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, category, title, content]
      );

      // Get the newly created post with author info
      const [newPost] = await pool.execute(
        `SELECT 
          fp.PostID as id,
          fp.UserID,
          u.name as author_name,
          fp.TopicCategory as category,
          fp.Title as title,
          fp.Content as content,
          fp.Timestamp as created_at,
          0 as comment_count
         FROM forumpost fp
         JOIN users u ON fp.UserID = u.id
         WHERE fp.PostID = ?`,
        [result.insertId]
      );

      console.log(`✅ Post created: "${title}" by user ${userId}`);
      res.status(201).json(newPost[0] || {});
    } catch (e) {
      console.error("❌ Create post error:", e);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // PATCH /api/community/posts/:id - Update forum post
  app.patch("/api/community/posts/:id", requireAuth, async (req, res) => {
    try {
      const postId = Number(req.params.id);
      const userId = req.user.id;
      const { title, content, category } = req.body;
      const pool = await getPool();

      // Check ownership
      const [posts] = await pool.execute(
        "SELECT UserID FROM forumpost WHERE PostID = ?",
        [postId]
      );

      if (posts.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (posts[0].UserID !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      // Build dynamic update query
      const updates = [];
      const params = [];
      
      if (title !== undefined) {
        updates.push("Title = ?");
        params.push(title);
      }
      if (content !== undefined) {
        updates.push("Content = ?");
        params.push(content);
      }
      if (category !== undefined) {
        updates.push("TopicCategory = ?");
        params.push(category);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      params.push(postId);

      await pool.execute(
        `UPDATE forumpost SET ${updates.join(", ")} WHERE PostID = ?`,
        params
      );

      // Get updated post
      const [updatedPost] = await pool.execute(
        `SELECT 
          fp.PostID as id,
          fp.UserID,
          u.name as author_name,
          fp.TopicCategory as category,
          fp.Title as title,
          fp.Content as content,
          fp.Timestamp as created_at,
          (SELECT COUNT(*) FROM comment c WHERE c.PostID = fp.PostID) as comment_count
         FROM forumpost fp
         JOIN users u ON fp.UserID = u.id
         WHERE fp.PostID = ?`,
        [postId]
      );

      console.log(`✅ Post updated: ${postId} by user ${userId}`);
      res.json(updatedPost[0] || {});
    } catch (e) {
      console.error("❌ Update post error:", e);
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  // DELETE /api/community/posts/:id - Delete forum post
  app.delete("/api/community/posts/:id", requireAuth, async (req, res) => {
    try {
      const postId = Number(req.params.id);
      const userId = req.user.id;
      const pool = await getPool();

      // Check ownership
      const [posts] = await pool.execute(
        "SELECT UserID FROM forumpost WHERE PostID = ?",
        [postId]
      );

      if (posts.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (posts[0].UserID !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      // Delete post (cascade should handle comments)
      await pool.execute(
        "DELETE FROM forumpost WHERE PostID = ?",
        [postId]
      );

      console.log(`🗑️ Post deleted: ${postId} by user ${userId}`);
      res.json({ ok: true, message: "Post deleted successfully" });
    } catch (e) {
      console.error("❌ Delete post error:", e);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // COMMENTS ENDPOINTS

  // GET /api/community/posts/:id/comments - Get comments for a post
  app.get("/api/community/posts/:id/comments", requireAuth, async (req, res) => {
    try {
      const postId = Number(req.params.id);
      const pool = await getPool();

      const [comments] = await pool.execute(
        `SELECT 
          c.CommentID as id,
          c.UserID,
          u.name as author_name,
          c.Content as content,
          c.Timestamp as created_at
         FROM comment c
         JOIN users u ON c.UserID = u.id
         WHERE c.PostID = ?
         ORDER BY c.Timestamp ASC`,
        [postId]
      );

      console.log(`💬 Retrieved ${comments.length} comments for post ${postId}`);
      res.json(comments);
    } catch (e) {
      console.error("❌ Get comments error:", e);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // POST /api/community/posts/:id/comments - Add comment to post
  app.post("/api/community/posts/:id/comments", requireAuth, async (req, res) => {
    try {
      const postId = Number(req.params.id);
      const { content } = req.body;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({ error: "Comment content is required" });
      }

      const pool = await getPool();

      // Verify post exists
      const [posts] = await pool.execute(
        "SELECT PostID FROM forumpost WHERE PostID = ?",
        [postId]
      );

      if (posts.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Add comment
      const [result] = await pool.execute(
        `INSERT INTO comment (PostID, UserID, Content, Timestamp) 
         VALUES (?, ?, ?, NOW())`,
        [postId, userId, content]
      );

      // Get the new comment with author info
      const [newComment] = await pool.execute(
        `SELECT 
          c.CommentID as id,
          c.UserID,
          u.name as author_name,
          c.Content as content,
          c.Timestamp as created_at
         FROM comment c
         JOIN users u ON c.UserID = u.id
         WHERE c.CommentID = ?`,
        [result.insertId]
      );

      console.log(`✅ Comment added to post ${postId} by user ${userId}`);
      res.status(201).json(newComment[0] || {});
    } catch (e) {
      console.error("❌ Add comment error:", e);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  // PATCH /api/community/comments/:id - Update comment
  app.patch("/api/community/comments/:id", requireAuth, async (req, res) => {
    try {
      const commentId = Number(req.params.id);
      const userId = req.user.id;
      const { content } = req.body;
      const pool = await getPool();

      // Check ownership
      const [comments] = await pool.execute(
        "SELECT UserID FROM comment WHERE CommentID = ?",
        [commentId]
      );

      if (comments.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comments[0].UserID !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      await pool.execute(
        "UPDATE comment SET Content = ? WHERE CommentID = ?",
        [content, commentId]
      );

      // Get updated comment
      const [updatedComment] = await pool.execute(
        `SELECT 
          c.CommentID as id,
          c.UserID,
          u.name as author_name,
          c.Content as content,
          c.Timestamp as created_at
         FROM comment c
         JOIN users u ON c.UserID = u.id
         WHERE c.CommentID = ?`,
        [commentId]
      );

      console.log(`✅ Comment updated: ${commentId} by user ${userId}`);
      res.json(updatedComment[0] || {});
    } catch (e) {
      console.error("❌ Update comment error:", e);
      res.status(500).json({ error: "Failed to update comment" });
    }
  });

  // DELETE /api/community/comments/:id - Delete comment
  app.delete("/api/community/comments/:id", requireAuth, async (req, res) => {
    try {
      const commentId = Number(req.params.id);
      const userId = req.user.id;
      const pool = await getPool();

      // Check ownership
      const [comments] = await pool.execute(
        "SELECT UserID FROM comment WHERE CommentID = ?",
        [commentId]
      );

      if (comments.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comments[0].UserID !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      await pool.execute(
        "DELETE FROM comment WHERE CommentID = ?",
        [commentId]
      );

      console.log(`🗑️ Comment deleted: ${commentId} by user ${userId}`);
      res.json({ ok: true, message: "Comment deleted successfully" });
    } catch (e) {
      console.error("❌ Delete comment error:", e);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // CATEGORIES ENDPOINTS

  // GET /api/community/categories - Get all topic categories
  app.get("/api/community/categories", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();

      const [categories] = await pool.execute(
        `SELECT 
          DISTINCT TopicCategory as name,
          COUNT(*) as post_count
         FROM forumpost 
         WHERE TopicCategory IS NOT NULL AND TopicCategory != ''
         GROUP BY TopicCategory
         ORDER BY post_count DESC`
      );

      console.log(`📂 Retrieved ${categories.length} forum categories`);
      res.json(categories);
    } catch (e) {
      console.error("❌ Get categories error:", e);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // EVENTS ENDPOINTS (Community Events)

  // GET /api/community/events - Get all events
  app.get("/api/community/events", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();

      const [events] = await pool.execute(
        `SELECT 
          e.EventID as id,
          e.Title as title,
          e.Description as description,
          e.EventType as type,
          e.EventDate as date,
          e.Location as location,
          e.MaxParticipants as max_participants,
          e.Topics as topics,
          e.CreatedBy,
          u.name as creator_name,
          e.CreatedAt as created_at,
          (SELECT COUNT(*) FROM eventregistrations er WHERE er.EventID = e.EventID) as registered_count
         FROM events e
         LEFT JOIN users u ON e.CreatedBy = u.id
         ORDER BY e.EventDate ASC`
      );

      // Format events for frontend
      const formattedEvents = events.map(event => ({
        ...event,
        topics: event.topics ? event.topics.split(',').map(t => t.trim()) : [],
        date: new Date(event.date).toISOString().split('T')[0],
        participants: event.max_participants // Add for frontend compatibility
      }));

      console.log(`🎯 Retrieved ${formattedEvents.length} community events`);
      res.json(formattedEvents);
    } catch (e) {
      console.error("❌ Get events error:", e);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // GET /api/community/events/:id - Get single event
  app.get("/api/community/events/:id", requireAuth, async (req, res) => {
    try {
      const eventId = Number(req.params.id);
      const pool = await getPool();

      const [events] = await pool.execute(
        `SELECT 
          e.EventID as id,
          e.Title as title,
          e.Description as description,
          e.EventType as type,
          e.EventDate as date,
          e.Location as location,
          e.MaxParticipants as max_participants,
          e.Topics as topics,
          e.CreatedBy,
          u.name as creator_name,
          e.CreatedAt as created_at,
          (SELECT COUNT(*) FROM eventregistrations er WHERE er.EventID = e.EventID) as registered_count
         FROM events e
         LEFT JOIN users u ON e.CreatedBy = u.id
         WHERE e.EventID = ?`,
        [eventId]
      );

      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      const event = {
        ...events[0],
        topics: events[0].topics ? events[0].topics.split(',').map(t => t.trim()) : [],
        date: new Date(events[0].date).toISOString().split('T')[0],
        participants: events[0].max_participants // Add for frontend compatibility
      };

      console.log(`📅 Retrieved event: ${event.title}`);
      res.json(event);
    } catch (e) {
      console.error("❌ Get event error:", e);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // POST /api/community/events - Create new event (Admin only)
  app.post("/api/community/events", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { title, description, eventType, eventDate, location, maxParticipants = 100, topics = '' } = req.body;

      // Allow admins and lecturers to create events
      if (userRole !== 'admin' && userRole !== 'lecturer') {
        return res.status(403).json({ error: "Permission denied. Only admins and lecturers can create events." });
      }

      if (!title || !description || !eventType || !eventDate || !location) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const pool = await getPool();

      const [result] = await pool.execute(
        `INSERT INTO events (Title, Description, EventType, EventDate, Location, MaxParticipants, Topics, CreatedBy, CreatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [title, description, eventType, eventDate, location, maxParticipants, topics, userId]
      );

      // Get the newly created event
      const [newEvent] = await pool.execute(
        `SELECT 
          e.EventID as id,
          e.Title as title,
          e.Description as description,
          e.EventType as type,
          e.EventDate as date,
          e.Location as location,
          e.MaxParticipants as max_participants,
          e.Topics as topics,
          e.CreatedBy,
          u.name as creator_name,
          e.CreatedAt as created_at,
          0 as registered_count
         FROM events e
         LEFT JOIN users u ON e.CreatedBy = u.id
         WHERE e.EventID = ?`,
        [result.insertId]
      );

      const event = {
        ...newEvent[0],
        topics: newEvent[0].topics ? newEvent[0].topics.split(',').map(t => t.trim()) : [],
        date: new Date(newEvent[0].date).toISOString().split('T')[0],
        participants: newEvent[0].max_participants // Add for frontend compatibility
      };

      console.log(`✅ Event created: "${title}" by ${userRole} user ${userId}`);
      res.status(201).json(event);
    } catch (e) {
      console.error("❌ Create event error:", e);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // PUT /api/community/events/:id - Update event (Admin, lecturer, or creator only)
  app.put("/api/community/events/:id", requireAuth, async (req, res) => {
    try {
      const eventId = Number(req.params.id);
      const userId = req.user.id;
      const userRole = req.user.role;
      const { title, description, eventType, eventDate, location, maxParticipants, topics } = req.body;
      const pool = await getPool();

      // Check if event exists and user has permission
      const [events] = await pool.execute(
        "SELECT CreatedBy FROM events WHERE EventID = ?",
        [eventId]
      );

      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Allow access if user is: admin, lecturer, or the creator
      const isCreator = events[0].CreatedBy === userId;
      const isAdmin = userRole === 'admin';
      const isLecturer = userRole === 'lecturer';

      if (!isCreator && !isAdmin && !isLecturer) {
        return res.status(403).json({ error: "Permission denied. Only admins, lecturers, or event creators can edit events." });
      }

      // Build dynamic update query
      const updates = [];
      const params = [];
      
      if (title !== undefined) { updates.push("Title = ?"); params.push(title); }
      if (description !== undefined) { updates.push("Description = ?"); params.push(description); }
      if (eventType !== undefined) { updates.push("EventType = ?"); params.push(eventType); }
      if (eventDate !== undefined) { updates.push("EventDate = ?"); params.push(eventDate); }
      if (location !== undefined) { updates.push("Location = ?"); params.push(location); }
      if (maxParticipants !== undefined) { updates.push("MaxParticipants = ?"); params.push(maxParticipants); }
      if (topics !== undefined) { updates.push("Topics = ?"); params.push(topics); }

      if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      params.push(eventId);

      await pool.execute(
        `UPDATE events SET ${updates.join(", ")} WHERE EventID = ?`,
        params
      );

      // Get updated event
      const [updatedEvent] = await pool.execute(
        `SELECT 
          e.EventID as id,
          e.Title as title,
          e.Description as description,
          e.EventType as type,
          e.EventDate as date,
          e.Location as location,
          e.MaxParticipants as max_participants,
          e.Topics as topics,
          e.CreatedBy,
          u.name as creator_name,
          e.CreatedAt as created_at,
          (SELECT COUNT(*) FROM eventregistrations er WHERE er.EventID = e.EventID) as registered_count
         FROM events e
         LEFT JOIN users u ON e.CreatedBy = u.id
         WHERE e.EventID = ?`,
        [eventId]
      );

      const event = {
        ...updatedEvent[0],
        topics: updatedEvent[0].topics ? updatedEvent[0].topics.split(',').map(t => t.trim()) : [],
        date: new Date(updatedEvent[0].date).toISOString().split('T')[0],
        participants: updatedEvent[0].max_participants
      };

      console.log(`✅ Event updated: ${eventId} by ${userRole} user ${userId}`);
      res.json(event);
    } catch (e) {
      console.error("❌ Update event error:", e);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  // DELETE /api/community/events/:id - Delete event (Admin, lecturer, or creator only)
  app.delete("/api/community/events/:id", requireAuth, async (req, res) => {
    try {
      const eventId = Number(req.params.id);
      const userId = req.user.id;
      const userRole = req.user.role;
      const pool = await getPool();

      // Check if event exists and user has permission
      const [events] = await pool.execute(
        "SELECT CreatedBy FROM events WHERE EventID = ?",
        [eventId]
      );

      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Allow access if user is: admin, lecturer, or the creator
      const isCreator = events[0].CreatedBy === userId;
      const isAdmin = userRole === 'admin';
      const isLecturer = userRole === 'lecturer';

      if (!isCreator && !isAdmin && !isLecturer) {
        return res.status(403).json({ error: "Permission denied. Only admins, lecturers, or event creators can delete events." });
      }

      // Delete event (cascade should handle registrations)
      await pool.execute(
        "DELETE FROM events WHERE EventID = ?",
        [eventId]
      );

      console.log(`🗑️ Event deleted: ${eventId} by ${userRole} user ${userId}`);
      res.json({ ok: true, message: "Event deleted successfully" });
    } catch (e) {
      console.error("❌ Delete event error:", e);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // EVENT REGISTRATION ENDPOINTS

  // GET /api/community/events/:id/registrations - Get user's registration status
  app.get("/api/community/events/:id/registrations/status", requireAuth, async (req, res) => {
    try {
      const eventId = Number(req.params.id);
      const userId = req.user.id;
      const pool = await getPool();

      const [registrations] = await pool.execute(
        "SELECT RegistrationID, Status FROM eventregistrations WHERE EventID = ? AND UserID = ?",
        [eventId, userId]
      );

      const isRegistered = registrations.length > 0;
      
      res.json({
        registered: isRegistered,
        registration: isRegistered ? registrations[0] : null
      });
    } catch (e) {
      console.error("❌ Get registration status error:", e);
      res.status(500).json({ error: "Failed to check registration status" });
    }
  });

  // POST /api/community/events/:id/registrations - Register for event
  app.post("/api/community/events/:id/registrations", requireAuth, async (req, res) => {
    try {
      const eventId = Number(req.params.id);
      const userId = req.user.id;
      const pool = await getPool();

      // Check if event exists
      const [events] = await pool.execute(
        "SELECT EventID, MaxParticipants FROM events WHERE EventID = ?",
        [eventId]
      );

      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check if already registered
      const [existing] = await pool.execute(
        "SELECT RegistrationID FROM eventregistrations WHERE EventID = ? AND UserID = ?",
        [eventId, userId]
      );

      if (existing.length > 0) {
        return res.status(409).json({ error: "Already registered for this event" });
      }

      // Check event capacity
      const [registrations] = await pool.execute(
        "SELECT COUNT(*) as count FROM eventregistrations WHERE EventID = ?",
        [eventId]
      );

      if (registrations[0].count >= events[0].MaxParticipants) {
        return res.status(400).json({ error: "Event is full" });
      }

      // Register for event
      const [result] = await pool.execute(
        `INSERT INTO eventregistrations (EventID, UserID, RegistrationDate, Status) 
         VALUES (?, ?, NOW(), 'registered')`,
        [eventId, userId]
      );

      console.log(`✅ User ${userId} registered for event ${eventId}`);
      res.status(201).json({ 
        ok: true, 
        message: "Successfully registered for event",
        registrationId: result.insertId 
      });
    } catch (e) {
      console.error("❌ Event registration error:", e);
      res.status(500).json({ error: "Failed to register for event" });
    }
  });

  // DELETE /api/community/events/:id/registrations - Unregister from event
  app.delete("/api/community/events/:id/registrations", requireAuth, async (req, res) => {
    try {
      const eventId = Number(req.params.id);
      const userId = req.user.id;
      const pool = await getPool();

      const [result] = await pool.execute(
        "DELETE FROM eventregistrations WHERE EventID = ? AND UserID = ?",
        [eventId, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Registration not found" });
      }

      console.log(`✅ User ${userId} unregistered from event ${eventId}`);
      res.json({ ok: true, message: "Successfully unregistered from event" });
    } catch (e) {
      console.error("❌ Event unregistration error:", e);
      res.status(500).json({ error: "Failed to unregister from event" });
    }
  });

  // STATISTICS ENDPOINTS

  // GET /api/community/stats - Get community statistics
  app.get("/api/community/stats", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();

      const [postCount] = await pool.execute("SELECT COUNT(*) as count FROM forumpost");
      const [commentCount] = await pool.execute("SELECT COUNT(*) as count FROM comment");
      const [userCount] = await pool.execute("SELECT COUNT(*) as count FROM users");
      const [eventCount] = await pool.execute("SELECT COUNT(*) as count FROM events WHERE EventDate >= CURDATE()");

      const stats = {
        total_posts: postCount[0].count,
        total_comments: commentCount[0].count,
        total_users: userCount[0].count,
        upcoming_events: eventCount[0].count
      };

      console.log(`📊 Retrieved community statistics`);
      res.json(stats);
    } catch (e) {
      console.error("❌ Get stats error:", e);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // COURSE DISCUSSIONS ENDPOINTS

  // GET /api/courses/discussions - Get course-specific discussions
  app.get("/api/courses/discussions", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();

      // For now, return course-related forum posts
      // Later you can create a separate course_discussions table
      const [discussions] = await pool.execute(
        `SELECT 
          fp.PostID as id,
          fp.UserID,
          u.name as author_name,
          fp.TopicCategory as course_name,
          fp.Title as title,
          fp.Content as content,
          fp.Timestamp as created_at,
          (SELECT COUNT(*) FROM comment c WHERE c.PostID = fp.PostID) as reply_count,
          (SELECT COUNT(DISTINCT c.UserID) FROM comment c WHERE c.PostID = fp.PostID) + 1 as participant_count
         FROM forumpost fp
         JOIN users u ON fp.UserID = u.id
         WHERE fp.TopicCategory IN ('JavaScript', 'React', 'Node.js', 'Python', 'Web Development')
         ORDER BY fp.Timestamp DESC
         LIMIT 20`
      );

      console.log(`📚 Retrieved ${discussions.length} course discussions`);
      res.json(discussions);
    } catch (e) {
      console.error("❌ Get course discussions error:", e);
      res.status(500).json({ error: "Failed to fetch course discussions" });
    }
  });

  // GET /api/courses - Get user's enrolled courses
  app.get("/api/courses", requireAuth, async (req, res) => {
    try {
      // For demo purposes, return sample courses
      // In a real app, you'd fetch from a courses table with user enrollment status
      const sampleCourses = [
        { 
          id: 1, 
          title: "JavaScript Fundamentals", 
          description: "Learn the basics of JavaScript programming", 
          enrolled: true 
        },
        { 
          id: 2, 
          title: "React Development", 
          description: "Build modern web applications with React", 
          enrolled: true 
        },
        { 
          id: 3, 
          title: "Node.js Backend", 
          description: "Server-side development with Node.js", 
          enrolled: false 
        },
        { 
          id: 4, 
          title: "Python Programming", 
          description: "Learn Python from scratch", 
          enrolled: false 
        },
        { 
          id: 5, 
          title: "HTML and CSS Basics", 
          description: "Web design fundamentals", 
          enrolled: true 
        }
      ];

      console.log(`📚 Retrieved ${sampleCourses.length} courses for user ${req.user.id}`);
      res.json(sampleCourses);
    } catch (e) {
      console.error("❌ Get courses error:", e);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  // GET /api/community/discussions - Get course-related discussions
  app.get("/api/community/discussions", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();

      // Get forum posts that are course-related (you can customize this query)
      const [discussions] = await pool.execute(
        `SELECT 
          fp.PostID as id,
          fp.UserID,
          u.name as author_name,
          fp.TopicCategory as course_name,
          fp.Title as title,
          fp.Content as content,
          fp.Timestamp as created_at,
          (SELECT COUNT(*) FROM comment c WHERE c.PostID = fp.PostID) as reply_count,
          (SELECT COUNT(DISTINCT c.UserID) FROM comment c WHERE c.PostID = fp.PostID) + 1 as participant_count
         FROM forumpost fp
         JOIN users u ON fp.UserID = u.id
         WHERE fp.TopicCategory IN ('JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS')
         ORDER BY fp.Timestamp DESC
         LIMIT 20`
      );

      console.log(`📚 Retrieved ${discussions.length} course discussions for user ${req.user.id}`);
      res.json(discussions);
    } catch (e) {
      console.error("❌ Get course discussions error:", e);
      res.status(500).json({ error: "Failed to fetch course discussions" });
    }
  });

  console.log('✅ Community routes registered successfully');
}