// src/utils/commentUtils.js

// Save pathway comments
export const savePathwayComments = (pathwayId, comments) => {
  try {
    localStorage.setItem(`pathway-comments-${pathwayId}`, JSON.stringify(comments));
  } catch (error) {
    console.error('Error saving pathway comments:', error);
  }
};

// Load pathway comments
export const loadPathwayComments = (pathwayId) => {
  try {
    const comments = localStorage.getItem(`pathway-comments-${pathwayId}`);
    return comments ? JSON.parse(comments) : [];
  } catch (error) {
    console.error('Error loading pathway comments:', error);
    return [];
  }
};

// Save level comments
export const saveLevelComments = (pathwaySlug, levelSlug, comments) => {
  try {
    localStorage.setItem(`comments-${pathwaySlug}-${levelSlug}`, JSON.stringify(comments));
  } catch (error) {
    console.error('Error saving level comments:', error);
  }
};

// Load level comments
export const loadLevelComments = (pathwaySlug, levelSlug) => {
  try {
    const comments = localStorage.getItem(`comments-${pathwaySlug}-${levelSlug}`);
    return comments ? JSON.parse(comments) : [];
  } catch (error) {
    console.error('Error loading level comments:', error);
    return [];
  }
};