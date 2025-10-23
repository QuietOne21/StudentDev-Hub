// src/pages/ResourcesPage.jsx
import { useState, useEffect, memo } from 'react';
import { api } from '../api';              // <-- path adjusted for pages/
import { API_BASE } from '../api';         // <-- to build absolute URLs
import '../resources.css';                       // <-- reuse your styles
// src/pages/ResourcesPage.jsx

import { 
  getSummary, 
  getObjectives, 
  getResourceId, 
  VIDEO_SUMMARIES, 
  LEARNING_OBJECTIVES 
} from '../data';   // <-- path is from /src/pages to /src




const TOPIC_TITLES = {
  0: "HTML and CSS Basics",
  1: "Java OOP",
  2: "JavaScript Basics",
  3: "Python Programming",
  4: "Database Fundamentals"
};

const absUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const base = (API_BASE || '').replace(/\/+$/, '');
  const path = String(u).startsWith('/') ? u : `/${u}`;
  return `${base}${path}`;
};

// Memoized StarRating Component
const StarRating = memo(({ rating, onRate, interactive = false }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={() => interactive && onRate?.(star)}
      >
        ★
      </span>
    ))}
  </div>
));

// Memoized Review Section
const ReviewSection = memo(({ resourceId, reviews, onAddReview, onLoadReviews }) => {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    onLoadReviews(resourceId);
  }, [resourceId, onLoadReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    await onAddReview(resourceId, text, rating);
    setText('');
    setRating(0);
    setShowForm(false);
  };

  const resourceReviews = reviews[resourceId] || [];
  const avgRating = resourceReviews.length > 0
    ? (resourceReviews.reduce((sum, r) => sum + r.rating, 0) / resourceReviews.length).toFixed(1)
    : 0;

  return (
    <div className="review-section">
      <div className="review-header">
        <h4>Reviews & Ratings</h4>
        <div className="rating-summary">
          <span className="average-rating">{avgRating}</span>
          <StarRating rating={parseFloat(avgRating)} />
          <span className="review-count">({resourceReviews.length} reviews)</span>
        </div>
      </div>

      <div className="reviews-list">
        {resourceReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <StarRating rating={review.rating} />
              <span className="review-date">{review.date}</span>
            </div>
            {review.text && <p className="review-text">{review.text}</p>}
          </div>
        ))}
      </div>

      <button 
        className="add-review-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowForm(!showForm);
        }}
      >
        <i className="fas fa-pen"></i>
        {showForm ? 'Cancel Review' : 'Write a Review'}
      </button>

      {showForm && (
        <div className="review-form">
          <div className="rating-input">
            <label>Your Rating:</label>
            <StarRating rating={rating} onRate={setRating} interactive={true} />
          </div>
          <div className="review-text-input">
            <label>Your Review:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience..."
              rows="3"
            />
          </div>
          <button 
            className="submit-review-btn" 
            onClick={handleSubmit}
            type="button"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
});

// Memoized Resource Card
const ResourceCard = memo(({ resource, isSaved, onToggleSave, onOpenVideo, reviews, onAddReview, onLoadReviews }) => {
  const handleWatchVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenVideo(resource.url, resource);
  };

  return (
    <div className="resource-card">
      <div className="resource-header" style={{ backgroundColor: `${resource.color || '#ccc'}20` }}>
        <div className="resource-type-badge">
          <i className={`fas ${
            resource.type === 'video' ? 'fa-video' :
            resource.type === 'tutorial' ? 'fa-book' :
            resource.type === 'practice' ? 'fa-laptop-code' :
            resource.type === 'project' ? 'fa-tools' : 'fa-file'
          }`}></i>
          {resource.type}
        </div>
        <button 
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(resource.id);
          }}
        >
          <i className="fas fa-bookmark"></i>
        </button>
      </div>

      <div className="resource-content">
        <h4>{resource.name}</h4>
        <p className="resource-topic">{resource.title}</p>

        {resource.duration && resource.type !== 'document' && (
          <div className="resource-meta">
            <span className="duration">
              <i className="fas fa-clock"></i> {resource.duration}
            </span>
          </div>
        )}

        {resource.description && (
          <p className="resource-description">{resource.description}</p>
        )}

        {resource.type === 'video' && resource.url && (
          <button 
            className="resource-link video-link"
            onClick={handleWatchVideo}
            type="button"
          >
            <i className="fab fa-youtube"></i>
            Watch Video
          </button>
        )}

        {(resource.type === 'tutorial' || resource.type === 'practice') && resource.url && (
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="resource-link"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fas fa-external-link-alt"></i>
            {resource.type === 'tutorial' ? 'View Tutorial' : 'Visit Platform'}
          </a>
        )}

        <ReviewSection 
          resourceId={resource.id} 
          reviews={reviews}
          onAddReview={onAddReview}
          onLoadReviews={onLoadReviews}
        />
      </div>
    </div>
  );
});

// Memoized Document Card
const DocumentCard = memo(({ resource, isSaved, onToggleSave, reviews, onAddReview, onLoadReviews }) => {
  const getFileIcon = (fileName) => {
    if (!fileName) return 'fa-file';
    const ext = fileName.toLowerCase();
    if (ext.includes('.pdf')) return 'fa-file-pdf';
    if (ext.includes('.doc')) return 'fa-file-word';
    if (ext.includes('.ppt')) return 'fa-file-powerpoint';
    return 'fa-file';
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(absUrl(resource.url), "_blank"); // use API_BASE
  };

  return (
    <div className="resource-card">
      <div className="resource-header" style={{ backgroundColor: `${resource.color || '#ccc'}20` }}>
        <div className="resource-type-badge">
          <i className={`fas ${getFileIcon(resource.content)}`}></i>
          Document
        </div>
        <button 
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(resource.id);
          }}
        >
          <i className="fas fa-bookmark"></i>
        </button>
      </div>

      <div className="resource-content">
        <h4>{resource.name}</h4>
        <p className="resource-topic">{resource.title}</p>

        <div className="document-meta">
          <div className="meta-item">
            <i className="fas fa-file"></i>
            <span>{resource.content}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-weight-hanging"></i>
            <span>{resource.duration}</span>
          </div>
        </div>

        {resource.description && (
          <p className="resource-description">{resource.description}</p>
        )}

        <button 
          className="resource-link download-btn"
          onClick={handleDownload}
          type="button"
        >
          <i className="fas fa-download"></i>
          Download Document
        </button>

        <ReviewSection 
          resourceId={resource.id} 
          reviews={reviews}
          onAddReview={onAddReview}
          onLoadReviews={onLoadReviews}
        />
      </div>
    </div>
  );
});

function ResourcesPage() {
  const USER_ID = "devhub-demo-user";

  const [resources, setResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [reviews, setReviews] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [activeLevel, setActiveLevel] = useState('beginner');
  const [expandedSections, setExpandedSections] = useState({
    videos: true,
    tutorials: true,
    practice: false,
    projects: true,
    documents: true
  });
  const [selectedResourceType, setSelectedResourceType] = useState('video');
  const [showAddResource, setShowAddResource] = useState(false);
  const [videoModal, setVideoModal] = useState({ isOpen: false, videoUrl: '', currentResource: null });
  const [showSavedView, setShowSavedView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    type: 'all',
    level: 'all',
    topic: 'all'
  });
  
  const [newResource, setNewResource] = useState({
    name: '', url: '', description: '', level: 'beginner', duration: ''
  });
  
  const [newDocument, setNewDocument] = useState({
    title: '', description: '', file: null, level: 'beginner'
  });

  // New states for modal features
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showNotesBox, setShowNotesBox] = useState(false);
  const [currentNotes, setCurrentNotes] = useState('');

  // Load initial data
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        const [resourcesRes, savedRes] = await Promise.all([
          api.getResources(),
          api.getSaved(USER_ID)
        ]);
        
        if (mounted) {
          if (resourcesRes.ok) setResources(resourcesRes.data || []);
          if (savedRes.ok) setSavedResources(savedRes.data || []);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  // Load reviews callback
  const handleLoadReviews = async (resourceId) => {
    if (reviews[resourceId]) return; // Already loaded
    
    try {
      const res = await api.getReviews(resourceId);
      if (res.ok) {
        setReviews(prev => ({ ...prev, [resourceId]: res.data || [] }));
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  // Add review callback
  const handleAddReview = async (resourceId, text, rating) => {
    if (!text.trim()) {
      alert("Please enter a review");
      return;
    }

    try {
      const res = await api.addReview({
        resourceId,
        text,
        rating,
        date: new Date().toISOString().slice(0, 10)
      });

      if (res.ok) {
        setReviews(prev => ({
          ...prev,
          [resourceId]: [
            ...(prev[resourceId] || []),
            {
              id: res.id,
              resource_id: resourceId,
              text,
              rating,
              date: new Date().toLocaleDateString()
            }
          ]
        }));
      }
    } catch (err) {
      console.error("Failed to add review:", err);
      alert("Failed to add review");
    }
  };

  // Video modal handlers
  const handleOpenVideo = (url, resource) => {
    setVideoModal({ isOpen: true, videoUrl: url, currentResource: resource });
    setShowShareMenu(false);
    setShowNotesBox(false);
    // Load existing notes for this video
    const savedNotes = JSON.parse(localStorage.getItem('videoNotes') || '{}');
    setCurrentNotes(savedNotes[resource.id] || '');
  };

  const handleCloseVideo = () => {
    setVideoModal({ isOpen: false, videoUrl: '', currentResource: null });
    setShowShareMenu(false);
    setShowNotesBox(false);
    setCurrentNotes('');
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  // Toggle save
  const handleToggleSave = async (resourceId) => {
    try {
      const isCurrentlySaved = savedResources.includes(resourceId);
      
      if (isCurrentlySaved) {
        const confirmed = window.confirm('Are you sure you want to unsave this resource?');
        if (!confirmed) return;
      }
      
      const res = await api.toggleSaved({ user_id: USER_ID, resource_id: resourceId });
      if (res.ok) {
        setSavedResources(prev =>
          res.saved ? [...prev, resourceId] : prev.filter(id => id !== resourceId)
        );
        
        if (!res.saved && videoModal.isOpen && videoModal.currentResource?.id === resourceId) {
          handleCloseVideo();
        }
      }
    } catch (err) {
      console.error("Toggle save failed:", err);
    }
  };

  // Share/Notes
  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
    setShowNotesBox(false);
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoModal.videoUrl);
    alert('Link copied to clipboard!');
    setShowShareMenu(false);
  };
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out: ${videoModal.currentResource?.name}`);
    const body = encodeURIComponent(`I thought you might be interested in this video:\n\n${videoModal.currentResource?.name}\n${videoModal.videoUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this video: ${videoModal.currentResource?.name}\n${videoModal.videoUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };
  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out: ${videoModal.currentResource?.name}`);
    const url = encodeURIComponent(videoModal.videoUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowShareMenu(false);
  };
  const handleShareFacebook = () => {
    const url = encodeURIComponent(videoModal.videoUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareMenu(false);
  };

  const handleToggleNotes = (e) => {
    e.stopPropagation();
    setShowNotesBox(!showNotesBox);
    setShowShareMenu(false);
  };
  const handleSaveNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('videoNotes') || '{}');
    savedNotes[videoModal.currentResource.id] = currentNotes;
    localStorage.setItem('videoNotes', JSON.stringify(savedNotes));
    alert('Notes saved successfully!');
  };

  // Toggle section
  const handleToggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Add resource
  const handleAddResource = async () => {
    if (!newResource.name.trim()) {
      alert('Please provide a name');
      return;
    }

    const resource = {
      title: TOPIC_TITLES[activeTab],
      type: selectedResourceType,
      name: newResource.name.trim(),
      url: newResource.url,
      description: newResource.description,
      level: newResource.level,
      duration: newResource.duration,
      icon: ['fa-html5', 'fa-java', 'fa-js', 'fa-python', 'fa-database'][activeTab],
      color: ['#ff6b6b', '#007396', '#ffcc00', '#9d4edd', '#f8961e'][activeTab]
    };

    try {
      const res = await api.addResource(resource);
      if (res.ok) {
        setResources(prev => [...prev, { id: res.id, ...resource }]);
        setNewResource({ name: '', url: '', description: '', level: 'beginner', duration: '' });
        setShowAddResource(false);
      }
    } catch (err) {
      alert("Failed to add resource");
    }
  };

  // Document upload
  const handleDocumentUpload = async (e) => {
    e.preventDefault();

    if (!newDocument.title.trim() || !newDocument.file) {
      alert('Please provide title and file');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('file', newDocument.file);

      if (newDocument.title) fd.append('title', newDocument.title);
      
      const uploadRes = await fetch(absUrl('/resources/upload'), {
        method: 'POST',
        body: fd,
        credentials: 'include'
      });

      console.log('📡 Upload response:', uploadRes.status, uploadRes.statusText);
      const text = await uploadRes.text();
      console.log('📦 Raw response body:', text);

     if (!uploadRes.ok) throw new Error(`Upload failed (${uploadRes.status})`);

     

     const uploadData = JSON.parse(text);
     console.log('✅ Upload success:', uploadData);

      const resource = {
        title: TOPIC_TITLES[activeTab],
        type: 'document',
        name: newDocument.title.trim(),
        content: uploadData.fileName,
        url: uploadData.url || `/uploads/resources/${uploadData.content}`,
        description: newDocument.description,
        level: newDocument.level,
        duration: uploadData.fileSize,
        icon: ['fa-html5', 'fa-java', 'fa-js', 'fa-python', 'fa-database'][activeTab],
        color: ['#ff6b6b', '#007396', '#ffcc00', '#9d4edd', '#f8961e'][activeTab]
      };

      const res = await api.addResource(resource);
      if (res.ok) {
        const resourcesRes = await api.getResources();
        if (resourcesRes.ok) setResources(resourcesRes.data);
        setNewDocument({ title: '', description: '', file: null, level: 'beginner' });
        setShowAddResource(false);
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
    }
  };

  // Search
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSearch(true);
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchFilters({ type: 'all', level: 'all', topic: 'all' });
    setShowSearch(false);
  };

  // Filter resources based on search and filters
  const getFilteredResources = () => {
    let filtered = resources;

    if (searchQuery.trim()) {
      filtered = filtered.filter(resource => 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchFilters.type !== 'all') {
      filtered = filtered.filter(resource => resource.type === searchFilters.type);
    }
    if (searchFilters.level !== 'all') {
      filtered = filtered.filter(resource => resource.level === searchFilters.level);
    }
    if (searchFilters.topic !== 'all') {
      filtered = filtered.filter(resource => resource.title === searchFilters.topic);
    }

    return filtered;
  };

  const searchedResources = getFilteredResources();
  const searchResultsCount = searchedResources.length;

  // Filter resources for normal view
  const filteredResources = showSavedView 
    ? resources.filter(r => savedResources.includes(r.id))
    : resources.filter(r => r.title === TOPIC_TITLES[activeTab] && r.level === activeLevel);

  const videos = showSearch ? searchedResources.filter(r => r.type === 'video') : filteredResources.filter(r => r.type === 'video');
  const tutorials = showSearch ? searchedResources.filter(r => r.type === 'tutorial') : filteredResources.filter(r => r.type === 'tutorial');
  const practice = showSearch ? searchedResources.filter(r => r.type === 'practice') : filteredResources.filter(r => r.type === 'practice');
  const documents = showSearch ? searchedResources.filter(r => r.type === 'document') : filteredResources.filter(r => r.type === 'document');
  const projects = showSearch ? searchedResources.filter(r => r.type === 'project') : filteredResources.filter(r => r.type === 'project');

  const handleGoHome = () => {
  try { 
    navigate('/dashboard'); 
  } catch { 
    window.location.href = '/dashboard'; 
  }
};

  return (
    <div className="resources-page content">

    <div className="home-btn-wrapper">
      <button className="home-btn" onClick={handleGoHome} type="button" aria-label="Back to Dashboard">🏠</button>
    </div>

      {/* Video Modal */}
      {videoModal.isOpen && (
        <div className="video-modal-overlay" onClick={handleCloseVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={handleCloseVideo}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="video-modal-layout">
              <div className="video-player-section">
                <div className="video-header">
                  <h3>{videoModal.currentResource?.name}</h3>
                  <div className="video-meta">
                    <span className="duration-badge">
                      <i className="fas fa-clock"></i> {videoModal.currentResource?.duration || '20 min'}
                    </span>
                    <span className="level-badge">
                      <i className="fas fa-chart-line"></i> {videoModal.currentResource?.level}
                    </span>
                  </div>
                </div>
                
                <div className="video-container">
                  <iframe
                    src={getEmbedUrl(videoModal.videoUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="video-actions">
                  <button 
                    className="action-btn save-video-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave(videoModal.currentResource.id);
                    }}
                  >
                    <i className="fas fa-bookmark"></i> 
                    {savedResources.includes(videoModal.currentResource.id) ? "Unsave Video" : "Save Video"}
                  </button>
                  
                  <div className="share-container">
                    <button 
                      className="action-btn share-btn"
                      onClick={handleShareClick}
                    >
                      <i className="fas fa-share"></i> Share
                    </button>
                    
                    {showShareMenu && (
                      <div className="share-menu">
                        <button className="share-option" onClick={handleCopyLink}>
                          <i className="fas fa-link"></i> Copy Link
                        </button>
                        <button className="share-option" onClick={handleShareEmail}>
                          <i className="fas fa-envelope"></i> Email
                        </button>
                        <button className="share-option" onClick={handleShareWhatsApp}>
                          <i className="fab fa-whatsapp"></i> WhatsApp
                        </button>
                        <button className="share-option" onClick={handleShareTwitter}>
                          <i className="fab fa-twitter"></i> Twitter
                        </button>
                        <button className="share-option" onClick={handleShareFacebook}>
                          <i className="fab fa-facebook"></i> Facebook
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="action-btn notes-btn"
                    onClick={handleToggleNotes}
                  >
                    <i className="fas fa-sticky-note"></i> Take Notes
                  </button>
                </div>

                {showNotesBox && (
                  <div className="notes-box">
                    <div className="notes-header">
                      <h4><i className="fas fa-edit"></i> Your Notes</h4>
                      <button 
                        className="notes-close" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotesBox(false);
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <textarea
                      className="notes-textarea"
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      placeholder="Write your notes here..."
                      rows="6"
                    />
                    <div className="notes-footer">
                      <small className="notes-hint">
                        <i className="fas fa-info-circle"></i> Notes are saved to your browser
                      </small>
                      <button className="notes-save-btn" onClick={handleSaveNotes}>
                        <i className="fas fa-save"></i> Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="video-side-panel">
                <div className="summary-section">
                  <h4>📝 Video Summary</h4>
                  <div className="summary-content">
                    <p>{getSummary(videoModal.currentResource)}</p>
                  </div>
                </div>

                <div className="stats-section">
                  <h4>📊 Quick Stats</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">
                        {(() => {
                          const resourceReviews = reviews[videoModal.currentResource?.id] || [];
                          if (resourceReviews.length === 0) return '0';
                          const avg = resourceReviews.reduce((sum, r) => sum + r.rating, 0) / resourceReviews.length;
                          return avg.toFixed(1);
                        })()}/5
                      </span>
                      <span className="stat-label">Rating</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{(reviews[videoModal.currentResource?.id] || []).length}</span>
                      <span className="stat-label">Reviews</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{videoModal.currentResource?.level}</span>
                      <span className="stat-label">Level</span>
                    </div>
                  </div>
                </div>

                <div className="learning-section">
                  <h4>🎯 What You'll Learn</h4>
                  <ul className="learning-points">
                    {getObjectives(videoModal.currentResource).map((obj, i) => (
                      <li key={i}>✓ {obj}</li>
                    ))}
                  </ul>
                </div>

                {(reviews[videoModal.currentResource?.id] || []).length > 0 && (
                  <div className="reviews-preview">
                    <h4>💬 Recent Reviews</h4>
                    <div className="preview-reviews">
                      {(reviews[videoModal.currentResource?.id] || []).slice(0, 2).map((review) => (
                        <div key={review.id} className="preview-review">
                          <div className="preview-rating">
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="preview-text">{review.text}</p>
                          <span className="preview-date">{review.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <header>
        <h1>StudentDev Hub - Learning Resources</h1>
        <p>Explore our collection of tutorials, documentation, and project ideas</p>
        
        {/* Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search resources by name, description, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
              {(searchQuery || showSearch) && (
                <button type="button" className="clear-search-btn" onClick={handleClearSearch}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </form>

          {/* Search Filters */}
          {showSearch && (
            <div className="search-filters">
              <div className="filter-group">
                <label>Type:</label>
                <select 
                  value={searchFilters.type}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="all">All Types</option>
                  <option value="video">Videos</option>
                  <option value="tutorial">Tutorials</option>
                  <option value="practice">Practice</option>
                  <option value="document">Documents</option>
                  <option value="project">Projects</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Level:</label>
                <select 
                  value={searchFilters.level}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, level: e.target.value }))}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Topic:</label>
                <select 
                  value={searchFilters.topic}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, topic: e.target.value }))}
                >
                  <option value="all">All Topics</option>
                  {Object.values(TOPIC_TITLES).map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <div className="tabs-container">
        {Object.entries(TOPIC_TITLES).map(([key, title]) => (
          <button
            key={key}
            className={`tab ${activeTab === parseInt(key) && !showSavedView && !showSearch ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(parseInt(key));
              setShowSavedView(false);
              setShowSearch(false);
              setSearchQuery('');
            }}
            style={{ borderBottomColor: ['#ff6b6b', '#007396', '#ffcc00', '#9d4edd', '#f8961e'][key] }}
          >
            <i className={`fab ${['fa-html5', 'fa-java', 'fa-js', 'fa-python'][key] || 'fa-database'}`}></i>
            {title}
          </button>
        ))}
        
        {/* Saved Resources Tab */}
        <button
          className={`tab saved-tab ${showSavedView && !showSearch ? 'active' : ''}`}
          onClick={() => {
            setShowSavedView(true);
            setShowSearch(false);
            setSearchQuery('');
          }}
          style={{ borderBottomColor: '#10b981' }}
        >
          <i className="fas fa-bookmark"></i>
          Saved Resources
          {savedResources.length > 0 && (
            <span className="saved-count">{savedResources.length}</span>
          )}
        </button>
      </div>
      
      <div className="tab-content">
        <div className="topic-header">
          <h2>
            {showSearch ? `Search Results (${searchResultsCount} found)` : 
             showSavedView ? 'Saved Resources' : TOPIC_TITLES[activeTab]}
          </h2>
          {showSearch && searchResultsCount > 0 && (
            <div className="search-summary">
              <p>Found {searchResultsCount} resources matching your search criteria</p>
            </div>
          )}
        </div>
        
        {!showSavedView && !showSearch && (
          <div className="level-selector">
            {['beginner', 'intermediate', 'advanced'].map(level => (
              <button 
                key={level}
                className={`level-btn ${activeLevel === level ? 'active' : ''}`}
                onClick={() => setActiveLevel(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        )}
        
        <div className="content-area">
          {!showAddResource ? (
            <>
              {!showSavedView && !showSearch && (
                <button className="add-resource-btn" onClick={() => setShowAddResource(true)}>
                  <i className="fas fa-plus"></i> Add Resource
                </button>
              )}
              
              {showSearch && searchResultsCount === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-search"></i>
                  <h3>No Resources Found</h3>
                  <p>No resources match your search criteria. Try adjusting your search terms or filters.</p>
                  <button className="clear-search-btn-large" onClick={handleClearSearch}>
                    Clear Search
                  </button>
                </div>
              ) : filteredResources.length === 0 && showSavedView ? (
                <div className="empty-state">
                  <i className="fas fa-bookmark"></i>
                  <h3>No Saved Resources Yet</h3>
                  <p>Start bookmarking your favorite resources by clicking the bookmark icon on any resource card.</p>
                </div>
              ) : filteredResources.length === 0 && !showSearch ? (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <h3>No Resources Available</h3>
                  <p>No resources found for the selected topic and level. Try adding some resources or changing the filter.</p>
                </div>
              ) : (
                <div className="resources-categorized">
                  {/* Videos */}
                  {(showSearch ? videos.length > 0 : true) && (
                    <div className="resource-section">
                      <div className="section-header" onClick={() => handleToggleSection('videos')}>
                        <div className="section-title">
                          <i className="fas fa-video"></i>
                          <h3>Videos {showSearch && <span className="count-badge">{videos.length}</span>}</h3>
                        </div>
                        <i className={`fas fa-chevron-${expandedSections.videos ? 'up' : 'down'}`}></i>
                      </div>
                      {expandedSections.videos && (
                        <div className="section-content">
                          {videos.length > 0 ? (
                            <div className="resources-grid">
                              {videos.map(resource => (
                                <ResourceCard 
                                  key={resource.id}
                                  resource={resource}
                                  isSaved={savedResources.includes(resource.id)}
                                  onToggleSave={handleToggleSave}
                                  onOpenVideo={handleOpenVideo}
                                  reviews={reviews}
                                  onAddReview={handleAddReview}
                                  onLoadReviews={handleLoadReviews}
                                />
                              ))}
                            </div>
                          ) : !showSearch ? (
                            <div className="empty-section">
                              <i className="fas fa-folder-open"></i>
                              <p>No videos available</p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tutorials */}
                  {(showSearch ? tutorials.length > 0 : true) && (
                    <div className="resource-section">
                      <div className="section-header" onClick={() => handleToggleSection('tutorials')}>
                        <div className="section-title">
                          <i className="fas fa-book"></i>
                          <h3>Tutorials {showSearch && <span className="count-badge">{tutorials.length}</span>}</h3>
                        </div>
                        <i className={`fas fa-chevron-${expandedSections.tutorials ? 'up' : 'down'}`}></i>
                      </div>
                      {expandedSections.tutorials && (
                        <div className="section-content">
                          {tutorials.length > 0 ? (
                            <div className="resources-grid">
                              {tutorials.map(resource => (
                                <ResourceCard 
                                  key={resource.id}
                                  resource={resource}
                                  isSaved={savedResources.includes(resource.id)}
                                  onToggleSave={handleToggleSave}
                                  onOpenVideo={handleOpenVideo}
                                  reviews={reviews}
                                  onAddReview={handleAddReview}
                                  onLoadReviews={handleLoadReviews}
                                />
                              ))}
                            </div>
                          ) : !showSearch ? (
                            <div className="empty-section">
                              <i className="fas fa-folder-open"></i>
                              <p>No tutorials available</p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practice */}
                  {(showSearch ? practice.length > 0 : true) && (
                    <div className="resource-section">
                      <div className="section-header" onClick={() => handleToggleSection('practice')}>
                        <div className="section-title">
                          <i className="fas fa-laptop-code"></i>
                          <h3>Practice {showSearch && <span className="count-badge">{practice.length}</span>}</h3>
                        </div>
                        <i className={`fas fa-chevron-${expandedSections.practice ? 'up' : 'down'}`}></i>
                      </div>
                      {expandedSections.practice && (
                        <div className="section-content">
                          {practice.length > 0 ? (
                            <div className="resources-grid">
                              {practice.map(resource => (
                                <ResourceCard 
                                  key={resource.id}
                                  resource={resource}
                                  isSaved={savedResources.includes(resource.id)}
                                  onToggleSave={handleToggleSave}
                                  onOpenVideo={handleOpenVideo}
                                  reviews={reviews}
                                  onAddReview={handleAddReview}
                                  onLoadReviews={handleLoadReviews}
                                />
                              ))}
                            </div>
                          ) : !showSearch ? (
                            <div className="empty-section">
                              <i className="fas fa-folder-open"></i>
                              <p>No practice resources available</p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Documents */}
                  {(showSearch ? documents.length > 0 : true) && (
                    <div className="resource-section">
                      <div className="section-header" onClick={() => handleToggleSection('documents')}>
                        <div className="section-title">
                          <i className="fas fa-file"></i>
                          <h3>Documents {showSearch && <span className="count-badge">{documents.length}</span>}</h3>
                        </div>
                        <i className={`fas fa-chevron-${expandedSections.documents ? 'up' : 'down'}`}></i>
                      </div>
                      {expandedSections.documents && (
                        <div className="section-content">
                          {documents.length > 0 ? (
                            <div className="resources-grid">
                              {documents.map(resource => (
                                <DocumentCard 
                                  key={resource.id}
                                  resource={resource}
                                  isSaved={savedResources.includes(resource.id)}
                                  onToggleSave={handleToggleSave}
                                  reviews={reviews}
                                  onAddReview={handleAddReview}
                                  onLoadReviews={handleLoadReviews}
                                />
                              ))}
                            </div>
                          ) : !showSearch ? (
                            <div className="empty-section">
                              <i className="fas fa-folder-open"></i>
                              <p>No documents available</p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Projects */}
                  {(showSearch ? projects.length > 0 : true) && (
                    <div className="resource-section">
                      <div className="section-header" onClick={() => handleToggleSection('projects')}>
                        <div className="section-title">
                          <i className="fas fa-rocket"></i>
                          <h3>Projects {showSearch && <span className="count-badge">{projects.length}</span>}</h3>
                        </div>
                        <i className={`fas fa-chevron-${expandedSections.projects ? 'up' : 'down'}`}></i>
                      </div>
                      {expandedSections.projects && (
                        <div className="section-content">
                          {projects.length > 0 ? (
                            <div className="projects-text-list">
                              {projects.map(project => (
                                <div key={project.id} className="project-text-item">
                                  <h4>{project.name}</h4>
                                  <p>{project.description}</p>
                                  {project.content && (
                                    <div className="project-ideas-text">
                                      {project.content.split('\n').map((idea, i) => (
                                        <div key={i}>• {idea}</div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : !showSearch ? (
                            <div className="empty-section">
                              <i className="fas fa-folder-open"></i>
                              <p>No projects available</p>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="resource-form-container">
              <h3>Add New Resource</h3>
              <div className="resource-type-selector">
                {['video', 'tutorial', 'practice', 'document'].map(type => (
                  <button
                    key={type}
                    className={`type-btn ${selectedResourceType === type ? 'active' : ''}`}
                    onClick={() => setSelectedResourceType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {selectedResourceType !== 'document' ? (
                <div className="add-resource-form">
                  <div className="form-group">
                    <label>Resource Name:</label>
                    <input 
                      type="text" 
                      value={newResource.name}
                      onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter resource name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Level:</label>
                    <select 
                      value={newResource.level}
                      onChange={(e) => setNewResource(prev => ({ ...prev, level: e.target.value }))}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>URL:</label>
                    <input 
                      type="url" 
                      value={newResource.url}
                      onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="Enter URL"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea 
                      value={newResource.description}
                      onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                      rows="3"
                    />
                  </div>
                  
                  {selectedResourceType === 'video' && (
                    <div className="form-group">
                      <label>Duration:</label>
                      <input 
                        type="text" 
                        value={newResource.duration}
                        onChange={(e) => setNewResource(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 30 min"
                      />
                    </div>
                  )}
                  
                  <div className="form-buttons">
                    <button className="cancel-btn" onClick={() => setShowAddResource(false)}>
                      Cancel
                    </button>
                    <button className="add-btn" onClick={handleAddResource}>
                      Add Resource
                    </button>
                  </div>
                </div>
              ) : (
                <div className="upload-document-form">
                  <form onSubmit={handleDocumentUpload}>
                    <div className="form-group">
                      <label>Document Title:</label>
                      <input 
                        type="text" 
                        value={newDocument.title}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter document title"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea 
                        value={newDocument.description}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter document description"
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Level:</label>
                      <select 
                        value={newDocument.level}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, level: e.target.value }))}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Select File (PDF, Word, PowerPoint):</label>
                      <input 
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              alert('File size must be less than 10MB');
                              e.target.value = '';
                              return;
                            }
                            setNewDocument(prev => ({ ...prev, file }));
                          }
                        }}
                        required
                      />
                      {newDocument.file && (
                        <div className="file-preview">
                          <i className="fas fa-file"></i>
                          <span>{newDocument.file.name}</span>
                          <span>({(newDocument.file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="form-buttons">
                      <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={() => setShowAddResource(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="upload-btn">
                        <i className="fas fa-upload"></i> Upload Document
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;
