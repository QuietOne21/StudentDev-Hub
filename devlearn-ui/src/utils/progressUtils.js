// src/utils/progressUtils.js

// Calculate overall progress across all pathways
export const calculateOverallProgress = (pathways) => {
  let totalChallenges = 0;
  let completedChallenges = 0;

  pathways.forEach(pathway => {
    pathway.levels?.forEach(level => {
      const progress = getLevelProgress(pathway.slug, level.slug);
      const levelChallenges = level.challenges?.length || 0;
      totalChallenges += levelChallenges;
      completedChallenges += Math.round((progress / 100) * levelChallenges);
    });
  });

  return totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
};

// Calculate progress for a specific pathway
export const calculatePathwayProgress = (pathway) => {
  let totalChallenges = 0;
  let completedChallenges = 0;

  pathway.levels?.forEach(level => {
    const progress = getLevelProgress(pathway.slug, level.slug);
    const levelChallenges = level.challenges?.length || 0;
    totalChallenges += levelChallenges;
    completedChallenges += Math.round((progress / 100) * levelChallenges);
  });

  return totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
};

// Get progress for a specific level
export const getLevelProgress = (pathwaySlug, levelSlug) => {
  const progress = localStorage.getItem(`progress-${pathwaySlug}-${levelSlug}`);
  if (progress) {
    const data = JSON.parse(progress);
    const completedCount = data.completedCount || 0;
    
    // Find the level to get total challenges
    const pathway = pathways.find(p => p.slug === pathwaySlug);
    const level = pathway?.levels.find(l => l.slug === levelSlug);
    const totalChallenges = level?.challenges?.length || 0;
    
    return totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0;
  }
  return 0;
};

// Get completion stats
export const getCompletionStats = (pathways) => {
  let stats = {
    totalPathways: pathways.length,
    completedPathways: 0,
    totalLevels: 0,
    completedLevels: 0,
    totalChallenges: 0,
    completedChallenges: 0
  };

  pathways.forEach(pathway => {
    let pathwayCompleted = true;
    
    pathway.levels?.forEach(level => {
      stats.totalLevels++;
      const levelProgress = getLevelProgress(pathway.slug, level.slug);
      const levelChallenges = level.challenges?.length || 0;
      stats.totalChallenges += levelChallenges;
      
      const completedInLevel = Math.round((levelProgress / 100) * levelChallenges);
      stats.completedChallenges += completedInLevel;
      
      if (levelProgress === 100) {
        stats.completedLevels++;
      } else {
        pathwayCompleted = false;
      }
    });
    
    if (pathwayCompleted) {
      stats.completedPathways++;
    }
  });

  return stats;
};
