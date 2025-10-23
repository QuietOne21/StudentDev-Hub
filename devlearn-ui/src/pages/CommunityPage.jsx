import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../community.css"; // ✅ This import is correct

// Add helpers near the top (after imports)
function normalizeDateString(s) {
  if (!s) return null;
  if (s === '0000-00-00 00:00:00') return null;
  let iso = s;
  if (typeof s === 'string' && !s.includes('T')) {
    iso = s.replace(' ', 'T');
    if (!/[Z+-]/.test(iso)) iso = iso + 'Z'; // assume UTC if no TZ
  }
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}
function formatDateForUI(s) {
  const d = normalizeDateString(s);
  return d ? d.toLocaleString() : 'Unknown date';
}

// SearchFilter Component
const SearchFilter = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="category-filter">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.name} value={category.name}>
              {category.name} ({category.post_count})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// AddTopicForm Component
const AddTopicForm = ({ 
  showAddTopicForm, 
  setShowAddTopicForm, 
  newTopicName, 
  setNewTopicName, 
  newTopicIcon, 
  setNewTopicIcon, 
  handleAddTopic 
}) => {
  if (!showAddTopicForm) return null;
  
  return (
    <div className="add-topic-form">
      <h3>Add New Topic</h3>
      <form onSubmit={handleAddTopic}>
        <div className="form-group">
          <label>Topic Name:</label>
          <input
            type="text"
            placeholder="Enter topic name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Select Icon:</label>
          <select
            value={newTopicIcon}
            onChange={(e) => setNewTopicIcon(e.target.value)}
            required
          >
            <option value="⚛️">⚛️ React</option>
            <option value="🚀">🚀 Performance</option>
            <option value="🔒">🔒 Security</option>
            <option value="📱">📱 Mobile</option>
            <option value="🤖">🤖 AI/ML</option>
            <option value="☁️">☁️ Cloud</option>
            <option value="🧪">🧪 Testing</option>
            <option value="⚡">⚡ DevOps</option>
            <option value="🎮">🎮 Game Development</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => setShowAddTopicForm(false)}>
            Cancel
          </button>
          <button type="submit">Add Topic</button>
        </div>
      </form>
    </div>
  );
};

// PostForm Component
const PostForm = ({ 
  showPostForm, 
  setShowPostForm, 
  newPostTitle, 
  setNewPostTitle, 
  newPostContent, 
  setNewPostContent, 
  newPostCategory, 
  setNewPostCategory, 
  categories, 
  handleSubmit,
  isEditing
}) => {
  if (!showPostForm) return null;

  return (
    <div className="post-form-overlay">
      <div className="post-form">
        <div className="post-form-header">
          <h3>{isEditing ? 'Edit Post' : 'Create New Post'}</h3>
          <button 
            className="close-btn"
            onClick={() => setShowPostForm(false)}
            type="button"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Title:</label>
            <input
              type="text"
              placeholder="Enter a descriptive title for your post"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="General">General Discussion</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Post Content:</label>
            <textarea
              placeholder="Write your post content here... You can include code snippets, questions, or share your knowledge."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows="8"
              required
            />
          </div>
          
          <div className="form-tips">
            <h4>Tips for a great post:</h4>
            <ul>
              <li>Be clear and specific about your question or topic</li>
              <li>Include code snippets when relevant</li>
              <li>Use proper formatting for better readability</li>
              <li>Add relevant tags/categories</li>
            </ul>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setShowPostForm(false)}>
              Cancel
            </button>
            <button type="submit">
              {isEditing ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// EventForm Component
const EventForm = ({ 
  showEventForm, 
  setShowEventForm, 
  eventData, 
  setEventData, 
  isEditing,
  handleEventSubmit,
  isAdmin 
}) => {
  if (!showEventForm || !isAdmin) return null;

  const eventTypes = ['Workshop', 'Hackathon', 'Seminar', 'Competition', 'Webinar', 'Conference'];

  return (
    <div className="post-form-overlay">
      <div className="post-form">
        <div className="post-form-header">
          <h3>{isEditing ? 'Edit Event' : 'Create New Event'}</h3>
          <button 
            className="close-btn"
            onClick={() => setShowEventForm(false)}
            type="button"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleEventSubmit}>
          <div className="form-group">
            <label>Event Title:</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Event Type:</label>
            <select
              value={eventData.eventType}
              onChange={(e) => setEventData({...eventData, eventType: e.target.value})}
              required
            >
              <option value="">Select Event Type</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={eventData.eventDate}
              onChange={(e) => setEventData({...eventData, eventDate: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              placeholder="Online/Physical location"
              value={eventData.location}
              onChange={(e) => setEventData({...eventData, location: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Max Participants:</label>
            <input
              type="number"
              placeholder="Maximum number of participants"
              value={eventData.maxParticipants}
              onChange={(e) => setEventData({...eventData, maxParticipants: parseInt(e.target.value) || 100})}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Topics (comma-separated):</label>
            <input
              type="text"
              placeholder="React, JavaScript, Web Development"
              value={eventData.topics}
              onChange={(e) => setEventData({...eventData, topics: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              placeholder="Describe the event details, agenda, and what participants will learn..."
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
              rows="6"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setShowEventForm(false)}>
              Cancel
            </button>
            <button type="submit">
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// EventDetails Component
const EventDetails = ({ 
  showEventDetails, 
  setShowEventDetails, 
  selectedEvent, 
  isRegistered,
  onRegister,
  isAdmin,
  onEdit,
  onDelete 
}) => {
  if (!showEventDetails || !selectedEvent) return null;

  return (
    <div className="post-form-overlay">
      <div className="post-form">
        <div className="post-form-header">
          <h3>Event Details</h3>
          <button 
            className="close-btn"
            onClick={() => setShowEventDetails(false)}
            type="button"
          >
            ×
          </button>
        </div>
        
        <div className="event-details-content">
          <div className="event-header">
            <h2>{selectedEvent.title}</h2>
            <span className="event-type-badge">{selectedEvent.type}</span>
          </div>
          
          <div className="event-info">
            <div className="info-item">
              <strong>📅 Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}
            </div>
            <div className="info-item">
              <strong>📍 Location:</strong> {selectedEvent.location}
            </div>
            <div className="info-item">
              <strong>👥 Max Participants:</strong> {selectedEvent.max_participants || selectedEvent.participants}
            </div>
            <div className="info-item">
              <strong>👤 Created by:</strong> {selectedEvent.creator_name}
            </div>
            {selectedEvent.topics && selectedEvent.topics.length > 0 && (
              <div className="info-item">
                <strong>🏷️ Topics:</strong>
                <div className="topics-list">
                  {selectedEvent.topics.map((topic, index) => (
                    <span key={index} className="topic-tag">{topic.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="event-description">
            <h4>Description:</h4>
            <p>{selectedEvent.description}</p>
          </div>
          
          <div className="event-actions">
            {isAdmin ? (
              <div className="admin-actions">
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(selectedEvent)}
                >
                  Edit Event
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(selectedEvent.id)}
                >
                  Delete Event
                </button>
              </div>
            ) : (
              <button 
                className={isRegistered ? 'unregister-btn' : 'register-btn'}
                onClick={() => onRegister(selectedEvent.id)}
              >
                {isRegistered ? 'Unregister' : 'Register for Event'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CommunityPage = () => {
  // Add user state
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const [activeTab, setActiveTab] = useState('forums');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    eventType: '',
    maxParticipants: 100,
    topics: ''
  });

  // Post states
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showAddTopicForm, setShowAddTopicForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicIcon, setNewTopicIcon] = useState("🔮");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // Add course discussions state
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [ setCourseDiscussions] = useState([]);

  // API Base URL
  const API_BASE_URL = 'http://localhost:3001/api';

  // Navigation
  const navigate = useNavigate();
  const handleGoHome = () => {
    try { navigate('/dashboard'); } catch { window.location.href = '/dashboard'; }
  };

  // Fetch initial data
  useEffect(() => {
    // fetch posts/categories/events on query changes
    fetchPosts();
    fetchCategories();
    fetchEvents();
    fetchUserRegistrations();
    fetchCourses();
   }, [currentPage, selectedCategory, searchQuery]);

  // Fetch user only once on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Add this function to fetch current user data
  const fetchUserData = async () => {
    try {
      // server exposes /api/me (see registerAuthRoutes in auth.js)
      const response = await fetch(`${API_BASE_URL}/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        setUserRole(userData.role);
        // Store user ID in localStorage for consistency
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
      } else {
        // Fallback to localStorage if available
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
          setUserRole(storedRole);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to localStorage
      const storedRole = localStorage.getItem('userRole');
      if (storedRole) {
        setUserRole(storedRole);
      }
    }
  };

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      });

      // Fix: Use correct community endpoint
      const response = await fetch(`${API_BASE_URL}/community/posts?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📝 Posts response:', data);
      
      // Fix: Handle the correct data structure
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]); // Set empty array on error
      setTotalPages(1);
    }
  };

  const fetchCategories = async () => {
    try {
      // Fix: Use correct community endpoint
      const response = await fetch(`${API_BASE_URL}/community/categories`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📂 Categories response:', data);
        
        // Fix: Data is already an array, no need to access .categories
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.warn('Failed to fetch categories:', response.status);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchEvents = async () => {
    try {
      // Fix: Use correct community endpoint
      const response = await fetch(`${API_BASE_URL}/community/events`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🎯 Events response:', data);
        
        // Fix: Data is already an array, no need to access .events
        setEvents(Array.isArray(data) ? data : []);
      } else {
        console.warn('Failed to fetch events:', response.status);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      // This would need to be implemented in your backend
      // For now, we'll check registration status individually when needed
      console.log('📋 Registration check would go here');
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const checkEventRegistration = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/events/${eventId}/registrations/status`, {
        credentials: 'include', // This sends cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.registered;
      }
      return false;
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        credentials: 'include', // ✅ Use cookies instead of token
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📚 Courses response:', data);
        setCourses(Array.isArray(data) ? data : []);
      } else {
        console.warn('Failed to fetch courses:', response.status);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  // Fetch course discussions
  const fetchCourseDiscussions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/discussions`, {
        credentials: 'include', // ✅ Use cookies instead of token
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📚 Course discussions response:', data);
        setCourseDiscussions(Array.isArray(data) ? data : []);
      } else {
        console.warn('Failed to fetch course discussions:', response.status);
        setCourseDiscussions([]);
      }
    } catch (error) {
      console.error('Error fetching course discussions:', error);
      setCourseDiscussions([]);
    }
  };

  // Post Management
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPostTitle.trim() === "" || newPostContent.trim() === "") return;

    try {
      const url = isEditingPost 
        ? `${API_BASE_URL}/community/posts/${currentPost.id}`
        : `${API_BASE_URL}/community/posts`;
      
      const method = isEditingPost ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include', // Use cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory
        })
      });

      if (!response.ok) throw new Error('Failed to save post');

      // Reset form and refresh data
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("");
      setShowPostForm(false);
      setIsEditingPost(false);
      setCurrentPost(null);
      
      fetchPosts();
      alert(isEditingPost ? 'Post updated successfully!' : 'Post created successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setNewPostTitle(post.title);
    setNewPostContent(post.content);
    setNewPostCategory(post.category);
    setIsEditingPost(true);
    setShowPostForm(true);
  };

  const handleDeletePost = async (postId) => {
    const currentUserId = currentUser?.id || parseInt(localStorage.getItem('userId'));
    const post = posts.find(p => p.id === postId);
    
    console.log('🔍 Delete attempt debug:', {
      postId,
      currentUserId,
      userRole,
      postOwner: post?.UserID,
      isOwner: post?.UserID === currentUserId,
      isAdmin: userRole === 'admin'
    });

    try {
      const response = await fetch(`http://localhost:3001/api/community/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        throw new Error(`Failed to delete post: ${response.status}`);
      }
      
      setPosts(posts.filter(post => post.id !== postId));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post: ' + error.message);
    }
  };

  // Comment Management
  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
        method: 'POST',
        credentials: 'include', // Use cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newComment
        })
      });

      if (!response.ok) throw new Error('Failed to add comment');

      setNewComment("");
      // Refresh the posts to get updated comments
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/comments/${commentId}`, {
        method: 'PATCH',
        credentials: 'include', // Use cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newContent
        })
      });

      if (!response.ok) throw new Error('Failed to update comment');

      fetchPosts();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/community/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include', // Use cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  // Event Management
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.description || !eventData.eventDate || !eventData.location) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const url = isEditing 
        ? `${API_BASE_URL}/community/events/${selectedEvent.id}`
        : `${API_BASE_URL}/community/events`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include', // Use cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) throw new Error('Failed to save event');

      setShowEventForm(false);
      setIsEditing(false);
      setSelectedEvent(null);
      setEventData({
        title: '',
        description: '',
        eventDate: '',
        location: '',
        eventType: '',
        maxParticipants: 100,
        topics: ''
      });
      
      fetchEvents();
      alert(isEditing ? 'Event updated successfully!' : 'Event created successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventData({
      title: event.title,
      description: event.description,
      eventDate: event.date,
      location: event.location,
      eventType: event.type,
      maxParticipants: event.max_participants || event.participants,
      topics: event.topics ? event.topics.join(',') : ''
    });
    setIsEditing(true);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/community/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include', // Use cookies instead of Bearer token
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete event');

      setEvents(events.filter(event => event.id !== eventId));
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleRegisterForEvent = async (eventId) => {
    try {
      const isRegistered = await checkEventRegistration(eventId);
      const url = `${API_BASE_URL}/community/events/${eventId}/registrations`;
      const method = isRegistered ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include', // Use cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to update registration');

      if (isRegistered) {
        setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
        alert('Successfully unregistered from event!');
      } else {
        setRegisteredEvents([...registeredEvents, eventId]);
        alert('Successfully registered for event!');
      }
      
      fetchEvents();
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('Failed to update registration');
    }
  };

  const handleShowEventDetails = async (event) => {
    setSelectedEvent(event);
    const isRegistered = await checkEventRegistration(event.id);
    if (isRegistered) {
      setRegisteredEvents([...registeredEvents, event.id]);
    }
    setShowEventDetails(true);
  };

  // Topic Management
  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopicName.trim() === "") return;

    const newTopic = {
      name: newTopicName,
      post_count: 0
    };

    setCategories([...categories, newTopic]);
    setNewTopicName("");
    setNewTopicIcon("🔮");
    setShowAddTopicForm(false);
  };

  const toggleComments = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      // Fetch comments for this post
      try {
        const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const comments = await response.json();
          // Update the post with comments
          setPosts(currentPosts => 
            currentPosts.map(post => 
              post.id === postId 
                ? { ...post, comments: comments }
                : post
            )
          );
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
      
      setExpandedPostId(postId);
    }
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update renderPostActions function
  const renderPostActions = (post) => {
    const currentUserId = currentUser?.id || parseInt(localStorage.getItem('userId'));
    const isOwner = post.UserID === currentUserId;
    const isAdmin = currentUser?.role === 'admin'; // ✅ Use actual role from API
    
    // Show edit/delete buttons if user owns the post OR is admin
    if (isOwner || isAdmin) {
      return (
        <div className="post-admin-actions">
          <button 
            className="edit-btn"
            onClick={() => handleEditPost(post)}
          >
            Edit
          </button>
          <button 
            className="delete-btn"
            onClick={() => handleDeletePost(post.id)}
          >
            Delete
          </button>
        </div>
      );
    }
    return null;
  };

  const renderForums = () => (
    <div className="forum-container">
      <h2>Discussion Forums</h2>
      
      <div className="forum-header">
        <SearchFilter 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        <div className="header-buttons">
          <button 
            className="add-topic-btn"
            onClick={() => setShowAddTopicForm(!showAddTopicForm)}
          >
            {showAddTopicForm ? 'Cancel' : '+ Add New Topic'}
          </button>
          <button 
            className="add-post-btn"
            onClick={() => {
              setIsEditingPost(false);
              setCurrentPost(null);
              setNewPostTitle("");
              setNewPostContent("");
              setNewPostCategory("");
              setShowPostForm(true);
            }}
          >
            + Create New Post
          </button>
        </div>
      </div>
      
      <AddTopicForm 
        showAddTopicForm={showAddTopicForm}
        setShowAddTopicForm={setShowAddTopicForm}
        newTopicName={newTopicName}
        setNewTopicName={setNewTopicName}
        newTopicIcon={newTopicIcon}
        setNewTopicIcon={setNewTopicIcon}
        handleAddTopic={handleAddTopic}
      />
      
      <PostForm 
        showPostForm={showPostForm}
        setShowPostForm={setShowPostForm}
        newPostTitle={newPostTitle}
        setNewPostTitle={setNewPostTitle}
        newPostContent={newPostContent}
        setNewPostContent={setNewPostContent}
        newPostCategory={newPostCategory}
        setNewPostCategory={setNewPostCategory}
        categories={categories}
        handleSubmit={handleSubmit}
        isEditing={isEditingPost}
        currentPost={currentPost}
      />
      
      <div className="posts-list">
        {filteredPosts.length === 0 ? (
          <div className="no-results">
            <p>No posts found matching your search.</p>
            <button 
              className="add-post-btn"
              onClick={() => setShowPostForm(true)}
            >
              Create the first post!
            </button>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-main">
                <h3>{post.title}</h3>
                <div className="post-meta">
                  <span className="author">by {post.author_name}</span>
                  <span className="date">{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className="category">{post.category}</span>
                </div>
                <div className="post-content-preview">
                  {post.content.substring(0, 200)}...
                </div>
              </div>
              <div className="post-replies">
                <div className="reply-count">{post.comment_count || 0} replies</div>
                <div className="post-actions">
                  <button 
                    className="reply-btn"
                    onClick={() => toggleComments(post.id)}
                  >
                    {expandedPostId === post.id ? 'Hide Comments' : 'View Comments'}
                  </button>
                  {/* Use the new render function */}
                  {renderPostActions(post)}
                </div>
              </div>
              
              {expandedPostId === post.id && (
                <div className="comments-section">
                  <h4>Comments ({post.comments ? post.comments.length : 0})</h4>
                  {post.comments && post.comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <div className="comment-author">{comment.author_name}</div>
                        <div className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</div>
                        {(comment.UserID === parseInt(localStorage.getItem('userId')) || currentUser?.role === 'admin') && (
                          <div className="comment-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => {
                                const newContent = prompt('Edit comment:', comment.content);
                                if (newContent) handleEditComment(comment.id, newContent);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="comment-text">{comment.content}</div>
                    </div>
                  ))}
                  <form onSubmit={(e) => handleAddComment(post.id, e)} className="add-comment">
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                    <button type="submit">Post Comment</button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="courses-container">
      <h2>Course-Specific Discussions</h2>
      <p>Select a course to view and participate in related discussions</p>
      
      <div className="courses-grid">
        {courses.length === 0 ? (
          <div className="no-courses">
            <p>No courses available yet.</p>
            <p>Enroll in courses to access course-specific discussions!</p>
          </div>
        ) : (
          courses.map(course => (
            <div
              key={course.id}
              className={`course-card ${course.enrolled ? 'enrolled' : 'not-enrolled'} ${selectedCourse?.id === course.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCourse(course);
              }}
            >
              <h3>{course.title}</h3>
              <p className="course-status">
                {course.enrolled ? '✅ Enrolled' : '❌ Not Enrolled'}
              </p>
              <p className="course-description">{course.description}</p>
              {course.enrolled && (
                <button 
                  className="view-discussions-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourse(course);
                    fetchCourseDiscussions();
                    }}
                  >
                    View Discussions
                  </button>
                  )}
                </div>
                ))
              )}
              </div>

              {selectedCourse && (
              <div className="course-discussions">
                <div className="discussion-header">
                <h3>Discussions for {selectedCourse.title}</h3>
                {selectedCourse.enrolled && (
                  <button 
                  className="add-post-btn"
                  onClick={() => {
                  setIsEditingPost(false);
                  setCurrentPost(null);
                  setNewPostTitle("");
                  setNewPostContent("");
                  setNewPostCategory(selectedCourse.title);
                  setShowPostForm(true);
                  // Keep the user on the courses tab - don't change activeTab
                }}
                type="button"
              >
                + Add Post to {selectedCourse.title}
              </button>
            )}
          </div>
          
          <div className="posts-list">
            {posts
              .filter(post => 
                post.category.toLowerCase().includes(selectedCourse.title.toLowerCase().split(' ')[0]) ||
                post.category.toLowerCase() === selectedCourse.title.toLowerCase()
              )
              .length === 0 ? (
              <div className="no-course-posts">
                <p>No discussions yet for {selectedCourse.title}</p>
                {selectedCourse.enrolled && (
                  <button 
                    className="add-post-btn"
                    onClick={() => {
                      setIsEditingPost(false);
                      setCurrentPost(null);
                      setNewPostTitle("");
                      setNewPostContent("");
                      setNewPostCategory(selectedCourse.title);
                      setShowPostForm(true);
                      // Keep the user on the courses tab - don't change activeTab
                    }}
                  >
                    Start the first discussion!
                  </button>
                )}
              </div>
            ) : (
              posts
                .filter(post => 
                  post.category.toLowerCase().includes(selectedCourse.title.toLowerCase().split(' ')[0]) ||
                  post.category.toLowerCase() === selectedCourse.title.toLowerCase()
                )
                .map(post => (
                  <div key={post.id} className="post-card">
                    <div className="post-main">
                      <h3>{post.title}</h3>
                      <div className="post-meta">
                        <span className="author">by {post.author_name}</span>
                        <span className="date">{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="category">{post.category}</span>
                      </div>
                      <div className="post-content-preview">
                        {post.content.substring(0, 200)}...
                      </div>
                    </div>
                    <div className="post-replies">
                      <div className="reply-count">{post.comment_count || 0} replies</div>
                      <div className="post-actions">
                        <button 
                          className="reply-btn"
                          onClick={() => toggleComments(post.id)}
                        >
                          {expandedPostId === post.id ? 'Hide Comments' : 'View Comments'}
                        </button>
                        {/* Use the same render function for course posts */}
                        {renderPostActions(post)}
                      </div>
                    </div>
                    
                    {expandedPostId === post.id && (
                      <div className="comments-section">
                        <h4>Comments ({post.comments ? post.comments.length : 0})</h4>
                        {post.comments && post.comments.map(comment => (
                          <div key={comment.id} className="comment">
                            <div className="comment-header">
                              <div className="comment-author">{comment.author_name}</div>
                              <div className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</div>
                              {(comment.UserID === parseInt(localStorage.getItem('userId')) || currentUser?.role === 'admin') && (
                                <div className="comment-actions">
                                  <button 
                                    className="edit-btn"
                                    onClick={() => {
                                      const newContent = prompt('Edit comment:', comment.content);
                                      if (newContent) handleEditComment(comment.id, newContent);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="comment-text">{comment.content}</div>
                          </div>
                        ))}
                        <form onSubmit={(e) => handleAddComment(post.id, e)} className="add-comment">
                          <textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                          />
                          <button type="submit">Post Comment</button>
                        </form>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* ✅ ADD THE POSTFORM COMPONENT HERE - This ensures it shows up in the Course Discussions tab */}
      <PostForm 
        showPostForm={showPostForm}
        setShowPostForm={setShowPostForm}
        newPostTitle={newPostTitle}
        setNewPostTitle={setNewPostTitle}
        newPostContent={newPostContent}
        setNewPostContent={setNewPostContent}
        newPostCategory={newPostCategory}
        setNewPostCategory={setNewPostCategory}
        categories={categories}
        handleSubmit={handleSubmit}
        isEditing={isEditingPost}
        currentPost={currentPost}
      />
    </div>
  );

  const renderEvents = () => (
    <div className="events-container">
      <div className="events-header">
        <h2>Upcoming Events & Hackathons</h2>
        <div className="events-controls">
          {/* ❌ REMOVE THIS ROLE SWITCHER - it's causing the issue */}
          {/* <div className="role-switcher">
            <label>View as: </label>
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}
          
          {/* ✅ Only show create button for actual admins/lecturers */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'lecturer') && (
            <button 
              className="add-event-btn"
              onClick={() => {
                setIsEditing(false);
                setSelectedEvent(null);
                setEventData({
                  title: '',
                  description: '',
                  eventDate: '',
                  location: '',
                  eventType: '',
                  maxParticipants: 100,
                  topics: ''
                });
                setShowEventForm(true);
              }}
            >
              + Create New Event
            </button>
          )}
        </div>
      </div>
      
      <div className="events-list">
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events available.</p>
            {(currentUser?.role === 'admin' || currentUser?.role === 'lecturer') && (
              <p>Create your first event to get started!</p>
            )}
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-date">
                <h3>{new Date(event.date).getDate()}</h3>
                <p>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</p>
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <div className="event-type">{event.type}</div>
                <div className="event-location">{event.location}</div>
                <div className="event-participants">
                  {event.registered_count || 0} / {event.max_participants || event.participants} registered
                </div>
                {event.topics && event.topics.length > 0 && (
                  <div className="event-topics">
                    {event.topics.map((topic, index) => (
                      <span key={index} className="topic-tag">{topic.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="event-actions">
                {/* ✅ Use actual user role, not the switcher variable */}
                {(currentUser?.role === 'admin' || currentUser?.role === 'lecturer') ? (
                  <div className="admin-controls">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                    <button 
                      className="details-btn"
                      onClick={() => handleShowEventDetails(event)}
                    >
                      View Details
                    </button>
                  </div>
                ) : (
                  <div className="student-controls">
                    <button 
                      className={registeredEvents.includes(event.id) ? 'registered-btn' : 'register-btn'}
                      onClick={() => handleRegisterForEvent(event.id)}
                    >
                      {registeredEvents.includes(event.id) ? 'Registered ✓' : 'Register'}
                    </button>
                    <button 
                      className="details-btn"
                      onClick={() => handleShowEventDetails(event)}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="community-page">
      <div className="home-btn-wrapper">
        <button className="home-btn" onClick={handleGoHome} type="button" aria-label="Back to Dashboard">🏠</button>
      </div>

      <header className="page-header">
        <div className="header-left">
          <h1>Developer Community & Support</h1>
          <p>Connect, learn and grow with fellow developers</p>
        </div>
      </header>

      <div className="tabs">
        <button 
          className={activeTab === 'forums' ? 'active' : ''}
          onClick={() => setActiveTab('forums')}
        >
          Discussion Forums
        </button>
        <button 
          className={activeTab === 'courses' ? 'active' : ''}
          onClick={() => setActiveTab('courses')}
        >
          Course Discussions
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          Events & Hackathons
        </button>
      </div>

      <div className="main-content">
        {activeTab === 'forums' && renderForums()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'events' && renderEvents()}
      </div>

      <EventForm 
        showEventForm={showEventForm}
        setShowEventForm={setShowEventForm}
        eventData={eventData}
        setEventData={setEventData}
        isEditing={isEditing}
        handleEventSubmit={handleEventSubmit}
        isAdmin={currentUser?.role === 'admin' || currentUser?.role === 'lecturer'} // ✅ Use actual role
      />
      
      <EventDetails 
        showEventDetails={showEventDetails}
        setShowEventDetails={setShowEventDetails}
        selectedEvent={selectedEvent}
        isRegistered={selectedEvent ? registeredEvents.includes(selectedEvent.id) : false}
        onRegister={handleRegisterForEvent}
        isAdmin={currentUser?.role === 'admin' || currentUser?.role === 'lecturer'} // ✅ Use actual role
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};
export default CommunityPage;