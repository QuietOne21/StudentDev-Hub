// /src/LevelsApi.js
// Levels & Pathways frontend API (uses the same API_BASE as src/api.js)
// Exports:
//  - named export: pathwayApi
//  - legacy named exports: fetchProgressFromBackend, saveProgressToBackend, fetchLevelCommentsFromBackend, addLevelCommentToBackend
//  - default export: levelApi (convenience)

import { API_BASE } from "./api"; // <- uses working base from src/api.js

// ensure base ends without trailing slash and build pathways base
const PATHWAYS_BASE = `${API_BASE.replace(/\/+$/, "")}/pathways`;

/* ---- fetchJson helper (keeps same shape as src/api.js) ---- */
async function fetchJson(url, method = "GET", body = null) {
  console.log(`🔄 API Call: ${method} ${url}`);

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);git
    console.log(`📡 Response: ${response.status} ${response.statusText}`);

    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      ...data,
    };
  } catch (error) {
    console.error("❌ API call failed:", error);
    return {
      ok: false,
      error: error.message,
      status: 0,
      data: null,
    };
  }
}

/* =========================
   pathwayApi (named export used by PathwayPage.jsx)
   ========================= */
export const pathwayApi = {
  // GET /api/pathways
  async getAllPathways() {
    const res = await fetchJson(`${PATHWAYS_BASE}`, "GET");
    if (!res.ok) throw new Error(res.error || "Failed to fetch pathways");
    return res.data || [];
  },

  // GET /api/pathways/dashboard-progress
  async getDashboardProgress() {
    const res = await fetchJson(`${PATHWAYS_BASE}/dashboard-progress`, "GET");
    if (!res.ok) throw new Error(res.error || "Failed to fetch dashboard progress");
    return res.data || {};
  },

  // GET /api/pathways/:pathwayId/comments
  async getPathwayComments(pathwayId) {
    const res = await fetchJson(`${PATHWAYS_BASE}/${encodeURIComponent(pathwayId)}/comments`, "GET");
    if (!res.ok) {
      console.warn("getPathwayComments failed, returning []");
      return [];
    }
    return res.data || [];
  },

  // POST /api/pathways/:pathwayId/comments
  async addPathwayComment(pathwayId, text) {
    if (!text || typeof text !== "string") {
      throw new Error("Comment text must be a non-empty string");
    }
    const res = await fetchJson(`${PATHWAYS_BASE}/${encodeURIComponent(pathwayId)}/comments`, "POST", { text });
    if (!res.ok) throw new Error(res.error || "Failed to add pathway comment");
    return res.data || null;
  }
};

/* =========================
   Legacy level API (keeps LevelPage.jsx working)
   ========================= */

/**
 * fetchProgressFromBackend(pathwaySlug, levelSlug)
 * Uses GET /api/pathways/progress then filters for the requested pathway/level.
 */
export async function fetchProgressFromBackend(pathwaySlug, levelSlug) {
  const res = await fetchJson(`${PATHWAYS_BASE}/progress`, "GET");
  if (!res.ok) {
    console.warn("fetchProgressFromBackend failed; falling back to localStorage");
    const local = localStorage.getItem(`progress-${pathwaySlug}-${levelSlug}`);
    return local ? JSON.parse(local) : null;
  }

  const rows = Array.isArray(res.data) ? res.data : [];

  const filtered = rows.filter(r => {
    return (r.pathwaySlug === pathwaySlug || r.roadmapSlug === pathwaySlug || r.roadmap_slug === pathwaySlug)
      && (r.levelSlug === levelSlug || r.level_slug === levelSlug);
  });

  if (filtered.length === 0) {
    const local = localStorage.getItem(`progress-${pathwaySlug}-${levelSlug}`);
    return local ? JSON.parse(local) : null;
  }

  const userAnswers = filtered.map(r => r.user_answer ?? "");
  const answerStatus = filtered.map(r => (Number(r.is_correct) === 1 ? "correct" : "incorrect"));
  const completedCount = answerStatus.filter(s => s === "correct").length;

  return { userAnswers, answerStatus, completedCount, raw: filtered };
}

/**
 * saveProgressToBackend(pathwaySlug, levelSlug, progressData)
 * Posts to POST /api/pathways/progress with the expected payload shape.
 */
export async function saveProgressToBackend(pathwaySlug, levelSlug, progressData = {}) {
  const payload = {
    pathwaySlug,
    levelSlug,
    userAnswers: progressData.userAnswers ?? [],
    answerStatus: progressData.answerStatus ?? [],
    completedCount: progressData.completedCount ?? 0
  };

  const res = await fetchJson(`${PATHWAYS_BASE}/progress`, "POST", payload);
  if (!res.ok) {
    console.warn("saveProgressToBackend failed, saving locally");
    try {
      localStorage.setItem(`progress-${pathwaySlug}-${levelSlug}`, JSON.stringify(payload));
      return { ok: true, message: "Saved locally" };
    } catch (e) {
      return { ok: false, error: e.message || "Failed to save locally" };
    }
  }

  return res.data ?? { ok: true, message: "Progress saved" };
}

/**
 * fetchLevelCommentsFromBackend(pathwaySlug, levelSlug)
 * GET /api/pathways/:pathwaySlug/:levelSlug/comments
 */
export async function fetchLevelCommentsFromBackend(pathwaySlug, levelSlug) {
  const res = await fetchJson(`${PATHWAYS_BASE}/${encodeURIComponent(pathwaySlug)}/${encodeURIComponent(levelSlug)}/comments`, "GET");
  if (!res.ok) {
    console.warn("fetchLevelCommentsFromBackend failed, falling back to localStorage");
    const local = localStorage.getItem(`comments-${pathwaySlug}-${levelSlug}`);
    return local ? JSON.parse(local) : [];
  }
  return res.data || [];
}

/**
 * addLevelCommentToBackend(pathwaySlug, levelSlug, commentText)
 * POST /api/pathways/:pathwaySlug/:levelSlug/comments
 */
export async function addLevelCommentToBackend(pathwaySlug, levelSlug, commentText) {
  if (!commentText || typeof commentText !== "string") {
    throw new Error("Comment text required");
  }

  const res = await fetchJson(
    `${PATHWAYS_BASE}/${encodeURIComponent(pathwaySlug)}/${encodeURIComponent(levelSlug)}/comments`,
    "POST",
    { text: commentText }
  );

  if (!res.ok) {
    console.warn("addLevelCommentToBackend failed, returning local mock");
    const mock = {
      postId: Date.now(),
      post_id: Date.now(),
      id: Date.now(),
      user_name: "You",
      text: commentText,
      created_at: new Date().toISOString()
    };
    try {
      const key = `comments-${pathwaySlug}-${levelSlug}`;
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.unshift({
        comment_id: mock.id,
        user_name: mock.user_name,
        comment_text: commentText,
        created_at: mock.created_at
      });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (_) {}
    return mock;
  }

  const d = res.data || {};
  return {
    comment_id: d.comment_id ?? d.id ?? null,
    user_name: d.user_name ?? d.user_name ?? "Unknown",
    comment_text: d.comment_text ?? d.text ?? commentText,
    created_at: d.created_at ?? new Date().toISOString()
  };
}

/* Default convenience export */
const levelApi = {
  pathwayApi,
  fetchProgressFromBackend,
  saveProgressToBackend,
  fetchLevelCommentsFromBackend,
  addLevelCommentToBackend
};

export default levelApi;
