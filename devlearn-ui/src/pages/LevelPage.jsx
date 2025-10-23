// LevelPage.jsx - Complete version with local storage
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { pathways } from "../pathways-data";
import '../LevelPage.css';

function LevelPage() {
  const { pathwaySlug, levelSlug } = useParams();
  const navigate = useNavigate();

  const [pathway, setPathway] = useState(null);
  const [level, setLevel] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answerStatus, setAnswerStatus] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [levelComments, setLevelComments] = useState([]);
  const [newLevelComment, setNewLevelComment] = useState("");
  const [showHints, setShowHints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [error, setError] = useState(null);

  // YouTube videos for each level type
  const youtubeVideos = {
    "java-dsa-beginner": "https://www.youtube.com/embed/eIrMbAQSU34",
    "java-dsa-intermediate": "https://www.youtube.com/embed/xTtL8E4LzTQ?si=Dv37PQYQxX5TLyxq",
    "java-dsa-expert": "https://www.youtube.com/embed/RBSGKlAvoiM",
    "html-beginner": "https://www.youtube.com/embed/qz0aGYrrlhU?si=IWRtXv1Lx-g6sWp_",
    "html-fundamentals-intermediate": "https://www.youtube.com/embed/pQN-pnXPaVg?si=FFuZYRe9tfB2ggoL",
    "html-fundamentals-expert": "https://www.youtube.com/embed/Wm6CUkswsNw",
    "css-beginner": "https://www.youtube.com/embed/OXGznpKZ_sA",
    "css-intermediate": "https://www.youtube.com/embed/1Rs2ND1ryYc",
    "css-expert": "https://www.youtube.com/embed/4deVCNJq3qc",
    "javascript-beginner": "https://www.youtube.com/embed/W6NZfCO5SIk",
    "javascript-intermediate": "https://www.youtube.com/embed/Mus_vwhTCq0",
    "javascript-expert": "https://www.youtube.com/embed/8aGhZQkoFbQ",
    "python-beginner": "https://www.youtube.com/embed/rfscVS0vtbw",
    "python-intermediate": "https://www.youtube.com/embed/HGOBQPFzWKo",
    "python-expert": "https://www.youtube.com/embed/f79MRyMsjrQ",
    "databases-beginner": "https://www.youtube.com/embed/HXV3zeQKqGY",
    "databases-intermediate": "https://www.youtube.com/embed/Cz3WcZLRaWc",
    "databases-expert": "https://www.youtube.com/embed/pPqazMTzNOM?si=8i6coWW3V20CMZ1K",
    "csharp-beginner": "https://www.youtube.com/embed/GhQdlIFylQ8",
    "csharp-intermediate": "https://www.youtube.com/embed/lisiwUZJXqQ",
    "csharp-expert": "https://www.youtube.com/embed/YT8s-90oDC0?si=zwjlQeodJLszwsp6",
  };

  // Update overall progress in localStorage
  const updateOverallProgress = () => {
    try {
      let totalChallenges = 0;
      let completedChallenges = 0;

      pathways.forEach(pathway => {
        pathway.levels?.forEach(level => {
          const progress = localStorage.getItem(`progress-${pathway.slug}-${level.slug}`);
          const levelChallenges = level.challenges?.length || 0;
          totalChallenges += levelChallenges;
          
          if (progress) {
            const data = JSON.parse(progress);
            completedChallenges += data.completedCount || 0;
          }
        });
      });

      const overallProgress = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
      localStorage.setItem('overall-learning-progress', JSON.stringify(overallProgress));
      console.log('Updated overall progress:', overallProgress);
    } catch (error) {
      console.error('Error updating overall progress:', error);
    }
  };

  // Load level data
  useEffect(() => {
    const loadLevelData = () => {
      try {
        setLoading(true);
        setError(null);
        
        // Find pathway and level from static data
        const foundPathway = pathways.find((p) => p.slug === pathwaySlug);
        const foundLevel = foundPathway?.levels.find((l) => l.slug === levelSlug);

        if (!foundPathway || !foundLevel) {
          setError("Level not found");
          setLoading(false);
          return;
        }

        setPathway(foundPathway);
        setLevel(foundLevel);

        // Set current level index for navigation
        const levelIndex = foundPathway.levels.findIndex(l => l.slug === levelSlug);
        setCurrentLevelIndex(levelIndex);

        // Initialize state based on challenges
        const challenges = foundLevel.challenges || [];
        setUserAnswers(Array(challenges.length).fill(""));
        setAnswerStatus(Array(challenges.length).fill(null));
        setShowHints(Array(challenges.length).fill(false));
        setCompletedCount(0);

        // Load progress from localStorage
        const localProgress = localStorage.getItem(`progress-${pathwaySlug}-${levelSlug}`);
        console.log('Loading progress from localStorage:', localProgress);
        if (localProgress) {
          const data = JSON.parse(localProgress);
          setUserAnswers(data.userAnswers || Array(challenges.length).fill(""));
          setAnswerStatus(data.answerStatus || Array(challenges.length).fill(null));
          setCompletedCount(data.completedCount || 0);
        }

        // Load level comments from localStorage
        const savedComments = localStorage.getItem(`comments-${pathwaySlug}-${levelSlug}`);
        console.log('Loading comments from localStorage:', savedComments);
        if (savedComments) {
          const parsedComments = JSON.parse(savedComments);
          setLevelComments(parsedComments);
          console.log('Parsed comments:', parsedComments);
        } else {
          setLevelComments([]);
        }

      } catch (err) {
        console.error('Error loading level data:', err);
        setError("Failed to load level data");
      } finally {
        setLoading(false);
      }
    };

    loadLevelData();
  }, [pathwaySlug, levelSlug]);

  // Handle input changes
  const handleChange = (idx, value) => {
    const copy = [...userAnswers];
    copy[idx] = value;
    setUserAnswers(copy);
  };

  const checkAnswer = (idx) => {
    if (!level?.challenges?.[idx]) return;

    const expected = (level.challenges[idx].solution || "").trim();
    const given = (userAnswers[idx] || "").trim();

    const isCorrect = given === expected;

    const copy = [...answerStatus];
    copy[idx] = isCorrect ? "correct" : "incorrect";
    setAnswerStatus(copy);

    const completed = copy.filter((s) => s === "correct").length;
    setCompletedCount(completed);

    // Save progress to localStorage
    const progressData = {
      userAnswers,
      answerStatus: copy,
      completedCount: completed,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(`progress-${pathwaySlug}-${levelSlug}`, JSON.stringify(progressData));
    console.log('Saved progress to localStorage:', progressData);
    
    // Update overall progress
    updateOverallProgress();
  };

  const resetAttempt = (idx) => {
    const copyStatus = [...answerStatus];
    copyStatus[idx] = null;
    setAnswerStatus(copyStatus);

    const copyAnswers = [...userAnswers];
    copyAnswers[idx] = "";
    setUserAnswers(copyAnswers);

    const completed = copyStatus.filter((s) => s === "correct").length;
    setCompletedCount(completed);

    // Update localStorage
    const progressData = {
      userAnswers: copyAnswers,
      answerStatus: copyStatus,
      completedCount: completed,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`progress-${pathwaySlug}-${levelSlug}`, JSON.stringify(progressData));
    console.log('Reset progress in localStorage:', progressData);
    
    // Update overall progress
    updateOverallProgress();
  };

  const toggleHint = (idx) => {
    const copy = [...showHints];
    copy[idx] = !copy[idx];
    setShowHints(copy);
  };

  const addLevelComment = () => {
    if (!newLevelComment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: "You",
      text: newLevelComment.trim(),
      timestamp: new Date().toLocaleString()
    };
    
    console.log('Adding new level comment:', newComment);
    
    const updatedComments = [...levelComments, newComment];
    setLevelComments(updatedComments);
    setNewLevelComment("");
    
    // Save to localStorage
    try {
      localStorage.setItem(`comments-${pathwaySlug}-${levelSlug}`, JSON.stringify(updatedComments));
      console.log('Saved level comments to localStorage:', updatedComments);
      
      // Verify it was saved
      const verify = localStorage.getItem(`comments-${pathwaySlug}-${levelSlug}`);
      console.log('Verified localStorage after save:', verify);
    } catch (storageErr) {
      console.error('Failed to save level comments to localStorage:', storageErr);
    }
  };

  const goToNextLevel = () => {
    if (!pathway) return;
    const nextLevel = pathway.levels[currentLevelIndex + 1];
    if (nextLevel) {
      navigate(`/level/${pathway.slug}/${nextLevel.slug}`);
    }
  };

  const goToPreviousLevel = () => {
    if (!pathway) return;
    const prevLevel = pathway.levels[currentLevelIndex - 1];
    if (prevLevel) {
      navigate(`/level/${pathway.slug}/${prevLevel.slug}`);
    }
  };

  // Calculate allDone safely
  const allDone = level?.challenges && completedCount === level.challenges.length;

  const videoKey = `${pathwaySlug}-${levelSlug}`;
  const youtubeUrl = youtubeVideos[videoKey] || "https://www.youtube.com/embed/HD13eq_Pmp8";

  if (loading) {
    return (
      <div className="level-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Level Content...</p>
        </div>
      </div>
    );
  }

  if (error || !pathway || !level) {
    return (
      <div className="level-page">
        <Link to="/PathwayPage" className="back-btn">← Back to Pathways</Link>
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Level not found</h2>
          <p>{error || "The pathway or level you requested does not exist."}</p>
          <Link to="/PathwayPage" className="home-btn">Return to Pathways</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="level-page">
      {/* Header */}
      <div className="level-header">
        <Link to="/PathwayPage" className="back-btn">
          <i className="fas fa-arrow-left"></i>
          Back to Pathways
        </Link>
        <div className="level-title-section" style={{ borderLeftColor: pathway.color }}>
          <div className="pathway-badge" style={{ backgroundColor: pathway.color }}>
            <i className={`fab ${pathway.icon}`}></i>
          </div>
          <div>
            <h1>{pathway.title} — {level.name}</h1>
            <p className="level-description">{level.description}</p>
            <div className="level-progress">
              <div className="progress-info">
                <span>Progress: {completedCount} / {level.challenges?.length || 0} challenges completed</span>
                {level.challenges && level.challenges.length > 0 && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${(completedCount / level.challenges.length) * 100}%`,
                        backgroundColor: pathway.color
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Navigation */}
      <div className="level-navigation">
        <button 
          className="nav-btn prev-btn"
          onClick={goToPreviousLevel}
          disabled={currentLevelIndex === 0}
        >
          <i className="fas fa-chevron-left"></i>
          Previous Level
        </button>
        
        <div className="level-steps">
          {pathway.levels.map((l, index) => (
            <div 
              key={l.slug}
              className={`level-step ${index === currentLevelIndex ? 'active' : ''} ${index < currentLevelIndex ? 'completed' : ''}`}
              onClick={() => navigate(`/level/${pathway.slug}/${l.slug}`)}
            >
              <div className="step-number">{index + 1}</div>
              <span className="step-title">{l.name}</span>
            </div>
          ))}
        </div>
        
        <button 
          className="nav-btn next-btn"
          onClick={goToNextLevel}
          disabled={currentLevelIndex === pathway.levels.length - 1}
        >
          Next Level
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="level-content">
        {/* YouTube Video Section */}
        <div className="video-section">
          <h2>🎥 Video Tutorial</h2>
          <p>Watch this tutorial to understand the concepts before diving into the challenges.</p>
          <div className="video-container">
            <iframe
              width="100%"
              height="400"
              src={youtubeUrl}
              title={`${pathway.title} ${level.name} Tutorial`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Learning Resources */}
        {level.resources && level.resources.length > 0 && (
          <div className="learning-path">
            <h2>📖 Learning Resources</h2>
            <p>Study these code snippets and examples to understand the concepts before attempting challenges.</p>
            <div className="learning-steps">
              {level.resources.map((r, i) => (
                <div className="resource-card" key={i}>
                  <div className="resource-header">
                    <div>
                      <div className="step-number">Step {i + 1}</div>
                      <h3>{r.title}</h3>
                    </div>
                    <div className="resource-badge">Example</div>
                  </div>
                  <p>{r.description}</p>
                  {r.codeSnippet && (
                    <pre className="code-snippet"><code>{r.codeSnippet}</code></pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Challenges */}
        <div className="code-challenges">
          <h2>🧪 Practice Challenges</h2>
          <p>Test your understanding by solving these challenges. Write the exact code snippet required.</p>
          <div className="progress-tracker">
            <span>Completed: {completedCount} / {level.challenges?.length || 0}</span>
            {allDone && <span className="completion-badge">🎉 All Challenges Complete!</span>}
          </div>

          {level.challenges && level.challenges.map((ch, idx) => (
            <div className={`resource-card challenge ${answerStatus[idx] === "correct" ? "completed" : ""}`} key={ch.id || idx}>
              <div className="challenge-header">
                <h3>Challenge {idx + 1}: {ch.title}</h3>
                <div className="challenge-status">
                  {answerStatus[idx] === "correct" && <span className="status-badge correct">✅ Completed</span>}
                  {answerStatus[idx] === "incorrect" && <span className="status-badge incorrect">❌ Try Again</span>}
                  {!answerStatus[idx] && <span className="status-badge pending">⏳ Not Started</span>}
                </div>
              </div>
              <p>{ch.description}</p>

              {/* Hint System */}
              <div className="hint-section">
                <button 
                  className="hint-btn" 
                  onClick={() => toggleHint(idx)}
                >
                  {showHints[idx] ? '🙈 Hide Hint' : '💡 Show Hint'}
                </button>
                {showHints[idx] && (
                  <div className="hint-text">
                    <strong>Hint:</strong> {ch.hint || "Make sure your code matches the expected output exactly. Check for proper syntax and spacing."}
                  </div>
                )}
              </div>

              <div className="code-editor">
                <textarea
                  rows={6}
                  placeholder="Write your solution here... (Tip: Use exact syntax as shown in examples)"
                  value={userAnswers[idx] || ""}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  disabled={answerStatus[idx] === "correct"}
                  className={answerStatus[idx] === "incorrect" ? "error" : ""}
                />
                <div className="editor-tips">
                  <small>💡 Press Ctrl+Enter to submit | Use proper indentation and syntax</small>
                </div>
              </div>

              <div className="challenge-actions">
                <button
                  className={`submit-btn ${answerStatus[idx] === "correct" ? "success" : ""}`}
                  onClick={() => checkAnswer(idx)}
                  disabled={answerStatus[idx] === "correct" || !userAnswers[idx]?.trim()}
                >
                  {answerStatus[idx] === "correct" ? "✅ Correct!" : "Submit Answer"}
                </button>

                {answerStatus[idx] === "incorrect" && (
                  <button onClick={() => resetAttempt(idx)} className="try-again-btn">
                    <i className="fas fa-redo"></i>
                    Try Again
                  </button>
                )}
              </div>

              {answerStatus[idx] === "correct" && (
                <div className="solution-section">
                  <div className="success-message">
                    ✅ Excellent! Your solution is correct.
                  </div>
                  <div className="expected-solution">
                    <strong>Expected solution:</strong>
                    <pre className="code-snippet solution">
                      <code>{ch.solution}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Completion Message */}
          {allDone && (
            <div className="completion-message resource-card">
              <div className="celebration">🎉</div>
              <h3>Level Complete!</h3>
              <p>Congratulations! You've completed all {level.name.toLowerCase()} challenges for {pathway.title}.</p>
              <div className="completion-actions">
                {currentLevelIndex < pathway.levels.length - 1 ? (
                  <button className="level-btn primary" onClick={goToNextLevel}>
                    Continue to Next Level →
                  </button>
                ) : (
                  <button className="level-btn secondary" onClick={() => navigate("/PathwayPage")}>
                    Return to Pathways
                  </button>
                )}
                <Link to="/PathwayPage" className="back-btn">Back to All Pathways</Link>
              </div>
            </div>
          )}
        </div>

        {/* Level-Specific Comments */}
        <div className="level-comments">
          <h2>💬 Level Discussion</h2>
          <p>Share your questions, insights, or help others with this level. Discuss challenges and share tips.</p>
          
          <div className="comments-container">
            {levelComments.length === 0 ? (
              <div className="no-comments">
                <i className="fas fa-comments"></i>
                <p>No comments yet. Be the first to start the discussion!</p>
                <small>Ask questions or share your experience with this level.</small>
              </div>
            ) : (
              levelComments.map(comment => (
                <div key={comment.id} className="comment">
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-meta">
                    <span className="comment-user">
                      <i className="fas fa-user"></i>
                      {comment.user}
                    </span>
                    <span className="comment-time">
                      <i className="fas fa-clock"></i>
                      {comment.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="comment-input">
            <textarea 
              value={newLevelComment} 
              onChange={(e) => setNewLevelComment(e.target.value)} 
              placeholder="Share your thoughts, ask questions, or help others with this level..." 
              rows={4}
            />
            <div className="comment-actions">
              <button 
                onClick={addLevelComment} 
                className="comment-btn"
                disabled={!newLevelComment.trim()}
              >
                <i className="fas fa-paper-plane"></i>
                Post Comment
              </button>
              <small className="comment-hint">
                Your comments help create a supportive learning community
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelPage;