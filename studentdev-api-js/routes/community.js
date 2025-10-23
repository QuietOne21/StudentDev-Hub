// ...existing code...

// Delete forum post
app.delete('/api/community/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    // Check if user owns the post or is admin
    const checkQuery = 'SELECT UserID FROM forumpost WHERE PostID = ?';
    const { rows: posts } = await query(checkQuery, [postId]);
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Allow deletion if user owns the post OR user is admin
    if (posts[0].UserID !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }
    
    // Delete the post (comments will be deleted automatically due to CASCADE)
    const deleteQuery = 'DELETE FROM forumpost WHERE PostID = ?';
    await query(deleteQuery, [postId]);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Delete event
app.delete('/api/community/events/:id', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    
    // Check if user created the event or is admin
    const checkQuery = 'SELECT CreatedBy FROM events WHERE EventID = ?';
    const { rows: events } = await query(checkQuery, [eventId]);
    
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Allow deletion if user created the event OR user is admin
    if (events[0].CreatedBy !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this event' });
    }
    
    // Delete the event (registrations will be deleted automatically due to CASCADE)
    const deleteQuery = 'DELETE FROM events WHERE EventID = ?';
    await query(deleteQuery, [eventId]);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.get('/api/notifications', requireAuth, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute(
      `SELECT id, user_id, title, body, type,
        CASE WHEN created_at = '0000-00-00 00:00:00' THEN NULL
             ELSE DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') END AS created_at,
        CASE WHEN read_at = '0000-00-00 00:00:00' THEN NULL
             ELSE DATE_FORMAT(read_at, '%Y-%m-%dT%H:%i:%sZ') END AS read_at,
        dismissed
       FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});
// ...existing code...