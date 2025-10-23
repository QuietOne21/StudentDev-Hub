// PathwayPage.jsx - Local storage only version
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pathways } from "../pathways-data";
import "../pathway-main.css";

export default function PathwayPage() {
  const [pathwaysData, setPathwaysData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const navigate = useNavigate();

  const handleGoHome = () => {
    try { 
      navigate('/dashboard'); 
    } catch { 
      window.location.href = '/dashboard'; 
    }
  };

  // Load pathways from static data
  useEffect(() => {
    loadPathways();
    loadStoredOverallProgress();
  }, []);

  // Load comments when active tab changes
  useEffect(() => {
    if (pathwaysData[activeTab]?.slug) {
      loadComments(pathwaysData[activeTab].slug);
    }
  }, [activeTab, pathwaysData]);

  // Recalculate overall progress when pathways load
  useEffect(() => {
    if (pathwaysData.length > 0) {
      calculateAndStoreOverallProgress();
    }
  }, [pathwaysData]);

  const loadPathways = () => {
    try {
      setLoading(true);
      // Use the static pathways data directly
      setPathwaysData(pathways);
      setError(null);
    } catch (err) {
      console.error("Failed to load pathways:", err);
      setError("Failed to load pathways. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load stored overall progress from localStorage
  const loadStoredOverallProgress = () => {
    try {
      const storedProgress = localStorage.getItem('overall-learning-progress');
      console.log('Loading overall progress from localStorage:', storedProgress);
      if (storedProgress) {
        setOverallProgress(JSON.parse(storedProgress));
      }
    } catch (error) {
      console.error('Error loading stored overall progress:', error);
    }
  };

  // Calculate and store overall progress
  const calculateAndStoreOverallProgress = () => {
    const progress = calculateOverallProgress();
    setOverallProgress(progress);
    
    // Store in localStorage
    localStorage.setItem('overall-learning-progress', JSON.stringify(progress));
    console.log('Stored overall progress:', progress);
  };

  // Calculate overall progress from all pathways and levels
  const calculateOverallProgress = () => {
    let totalChallenges = 0;
    let completedChallenges = 0;

    pathwaysData.forEach(pathway => {
      pathway.levels?.forEach(level => {
        const completedCount = getLevelCompletedCount(pathway.slug, level.slug);
        const levelChallenges = level.challenges?.length || 0;
        totalChallenges += levelChallenges;
        completedChallenges += completedCount;
      });
    });

    return totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
  };

  // Get completed challenge count for a level
  const getLevelCompletedCount = (pathwaySlug, levelSlug) => {
    const progress = localStorage.getItem(`progress-${pathwaySlug}-${levelSlug}`);
    if (progress) {
      const data = JSON.parse(progress);
      return data.completedCount || 0;
    }
    return 0;
  };

  // Calculate percentage progress for a level
  const calculateLevelProgress = (pathwaySlug, levelSlug) => {
    const completedCount = getLevelCompletedCount(pathwaySlug, levelSlug);
    const pathway = pathwaysData.find(p => p.slug === pathwaySlug);
    const level = pathway?.levels.find(l => l.slug === levelSlug);
    
    if (level) {
      const totalChallenges = level.challenges.length;
      return totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0;
    }
    return 0;
  };

  // Calculate pathway progress
  const calculatePathwayProgress = (pathway) => {
    let totalChallenges = 0;
    let completedChallenges = 0;

    pathway.levels?.forEach(level => {
      const completedCount = getLevelCompletedCount(pathway.slug, level.slug);
      const levelChallenges = level.challenges?.length || 0;
      totalChallenges += levelChallenges;
      completedChallenges += completedCount;
    });

    return totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
  };

  // Load comments for a pathway from localStorage only
  const loadComments = (pathwaySlug) => {
    try {
      const localComments = localStorage.getItem(`pathway-comments-${pathwaySlug}`);
      console.log(`Loading comments for ${pathwaySlug} from localStorage:`, localComments);
      
      if (localComments) {
        const parsedComments = JSON.parse(localComments);
        setComments(prev => ({
          ...prev,
          [pathwaySlug]: parsedComments
        }));
      } else {
        // Initialize with empty array if no comments exist
        setComments(prev => ({
          ...prev,
          [pathwaySlug]: []
        }));
        // Also save empty array to localStorage
        localStorage.setItem(`pathway-comments-${pathwaySlug}`, JSON.stringify([]));
      }
    } catch (err) {
      console.error("Failed to load comments from localStorage:", err);
      setComments(prev => ({
        ...prev,
        [pathwaySlug]: []
      }));
    }
  };

  // Add comment to pathway - local storage only
  const addComment = () => {
    if (!newComment.trim()) return;
    
    const pathwaySlug = pathwaysData[activeTab].slug;
    const newCommentObj = {
      comment_id: Date.now(), // Generate unique ID
      user_name: "You", // Local user
      comment_text: newComment.trim(),
      created_at: new Date().toISOString()
    };
    
    console.log('Adding new comment:', newCommentObj);
    
    // Update local state
    const updatedComments = [...(comments[pathwaySlug] || []), newCommentObj];
    
    setComments(prev => ({
      ...prev,
      [pathwaySlug]: updatedComments
    }));
    
    // Store in localStorage
    try {
      localStorage.setItem(`pathway-comments-${pathwaySlug}`, JSON.stringify(updatedComments));
      console.log('Saved comments to localStorage:', updatedComments);
      
      // Verify it was saved
      const verify = localStorage.getItem(`pathway-comments-${pathwaySlug}`);
      console.log('Verified localStorage after save:', verify);
    } catch (storageErr) {
      console.error('Failed to save comments to localStorage:', storageErr);
    }
    
    setNewComment("");
  };

  // Filter pathways based on search
  const filteredPathways = pathwaysData.filter(pathway => 
    pathway.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pathway.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPathway = filteredPathways[activeTab];
  const currentComments = currentPathway ? (comments[currentPathway.slug] || []) : [];

  if (loading) {
    return (
      <div className="pathway-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading Pathways...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pathway-page-error">
        <i className="fas fa-exclamation-triangle"></i>
        <h2>Error Loading Pathways</h2>
        <p>{error}</p>
        <button onClick={loadPathways} className="retry-btn">
          <i className="fas fa-redo"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pathway-page">
      <div className="home-btn-wrapper">
        <button className="home-btn" onClick={handleGoHome} type="button" aria-label="Back to Dashboard">
          🏠
        </button>
      </div>
      
      {/* Header Section */}
      <header className="pathway-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, Developer!</h1>
            <p>Here's your learning snapshot and what's next on your roadmap.</p>
          </div>
          <div className="search-container">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search pathways (Java, HTML, CSS, etc.)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Stats Row */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>Your Progress</h3>
            <div className="stat-main">
              <span className="stat-value">{overallProgress}%</span>
              <span className="stat-change positive">
                {getProgressChangeText()}
              </span>
            </div>
            <p className="stat-label">Across all pathways</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
            <i className="fas fa-road"></i>
          </div>
          <div className="stat-content">
            <h3>Active Pathways</h3>
            <div className="stat-main">
              <span className="stat-value">{pathwaysData.length}</span>
            </div>
            <p className="stat-label">Available learning paths</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <h3>Total Challenges</h3>
            <div className="stat-main">
              <span className="stat-value">{getTotalChallenges()}</span>
            </div>
            <p className="stat-label">Across all levels</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#8b5cf620', color: '#8b5cf6' }}>
            <i className="fas fa-comments"></i>
          </div>
          <div className="stat-content">
            <h3>Discussion</h3>
            <div className="stat-main">
              <span className="stat-value">{currentComments.length}</span>
            </div>
            <p className="stat-label">Total comments</p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content-section">
        <div className="section-header">
          <h2>Learning Pathways</h2>
          <p>Choose your learning track and start building skills</p>
        </div>

        {/* Pathway Tabs */}
        <div className="tabs-container">
          {filteredPathways.map((pathway, i) => (
            <button
              key={pathway.slug}
              className={`tab ${activeTab === i ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
              style={{ borderBottomColor: pathway.color }}
            >
              <i className={`fab ${pathway.icon}`}></i>
              {pathway.title}
            </button>
          ))}
        </div>

        {/* Pathway Content */}
        {currentPathway && (
          <div className="pathway-content">
            <div className="topic-header">
              <div className="topic-icon" style={{ 
                backgroundColor: `${currentPathway.color}20`, 
                color: currentPathway.color 
              }}>
                <i className={`fab ${currentPathway.icon}`}></i>
              </div>
              <div>
                <h2>{currentPathway.title}</h2>
                <p className="topic-description">{currentPathway.description}</p>
                <div className="pathway-progress">
                  <span>Pathway Progress: {calculatePathwayProgress(currentPathway)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${calculatePathwayProgress(currentPathway)}%`,
                        backgroundColor: currentPathway.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Levels Grid */}
            <div className="levels-container">
              <h3>Learning Levels</h3>
              <div className="levels-grid">
                {currentPathway.levels?.map((level, idx) => (
                  <Link 
                    key={idx} 
                    to={`/level/${currentPathway.slug}/${level.slug}`} 
                    className="level-card-link"
                  >
                    <div className="level-card" style={{ borderLeftColor: currentPathway.color }}>
                      <div className="level-card-header">
                        <h4 className="level-title">{level.name}</h4>
                        <div className="progress-indicator">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ 
                                width: `${calculateLevelProgress(currentPathway.slug, level.slug)}%`,
                                backgroundColor: currentPathway.color
                              }}
                            ></div>
                          </div>
                          <span className="progress-text">
                            {calculateLevelProgress(currentPathway.slug, level.slug)}%
                          </span>
                        </div>
                      </div>
                      <p className="level-preview">{level.description}</p>
                      <div className="level-stats">
                        <span className="stat">
                          <i className="fas fa-book"></i>
                          {level.resources.length} lessons
                        </span>
                        <span className="stat">
                          <i className="fas fa-code"></i>
                          {level.challenges.length} challenges
                        </span>
                      </div>
                      <div className="level-footer">
                        <button 
                          className="level-btn" 
                          style={{ backgroundColor: currentPathway.color }}
                        >
                          {calculateLevelProgress(currentPathway.slug, level.slug) > 0 
                            ? 'Continue' 
                            : 'Start Learning'} →
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="comments-section-below">
              <div className="section-header">
                <h3>Discussion & Notes</h3>
                <p>Share your thoughts and questions about this pathway</p>
              </div>
              <div className="comments-container">
                {currentComments.length === 0 ? (
                  <p className="no-comments">No comments yet. Start the discussion!</p>
                ) : (
                  currentComments.map(comment => (
                    <div key={comment.comment_id} className="comment">
                      <p className="comment-text">{comment.comment_text}</p>
                      <div className="comment-meta">
                        <span className="comment-user">{comment.user_name}</span>
                        <span className="comment-time">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="comment-input">
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  placeholder="Add your comment or note about this pathway..." 
                  rows={3} 
                />
                <button 
                  onClick={addComment} 
                  className="comment-btn"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper functions
  function getTotalChallenges() {
    return pathwaysData.reduce((total, pathway) => 
      total + pathway.levels?.reduce((levelTotal, level) => 
        levelTotal + (level.challenges?.length || 0), 0) || 0, 0);
  }

  function getProgressChangeText() {
    if (overallProgress === 0) return 'Start learning!';
    if (overallProgress < 25) return 'Getting started';
    if (overallProgress < 50) return 'Making progress';
    if (overallProgress < 75) return 'Halfway there!';
    if (overallProgress < 100) return 'Almost done!';
    return 'Completed!';
  }
}