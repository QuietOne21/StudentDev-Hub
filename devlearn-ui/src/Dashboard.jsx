// src/Dashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "./api";
import { Link, useLocation } from "react-router-dom";


export default function Dashboard() {
  // local bootstrap (fallback to localStorage)
  const [userData, setUserData] = useState(() => {
    const name = localStorage.getItem("name") || "Developer";
    const role = (localStorage.getItem("role") || "student").toLowerCase();
    const theme = (localStorage.getItem("theme") || "dark").toLowerCase();
    return { name, role, theme };
  });
  const [role] = useState(userData.role);
  const [theme] = useState(userData.theme);

  // === Resources upload state ===
const [pendingUploads, setPendingUploads] = useState([]);
const [uploadingAll, setUploadingAll] = useState(false);

const [overviewTab, setOverviewTab] = useState("metrics"); // "metrics" | "files"



  // server-backed state
const [server, setServer] = useState({
  profile: null,
  progress: 0,
  notifications: [],
  quickLinks: [],
  resources: [],
  stats: [],
  overview: { activeUsers7d: 0, modulesCount: 0, snippetsCount: 0 },
});


  // derived UI state
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const { pathname } = useLocation();
const isActive = (p) => (pathname === p ? "side-link active" : "side-link");


  function latest(field, fallback = null) {
  const row = server?.stats?.[0];
  return row && row[field] != null ? row[field] : fallback;
}

function avgLast7(field, fallback = null) {
  const list = server?.stats || [];
  if (!list.length) return fallback;
  const sum = list.reduce((a, r) => a + (Number(r[field]) || 0), 0);
  return sum / list.length;
}

function fmtMinutes(mins) {
  if (mins == null) return "0h 0m";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
}

function fmtPercent(n) {
  if (n == null) return "0%";
  return `${Math.round(n)}%`;
}

function initialsFrom(name) {
  const s = (name || "").trim();
  if (!s) return "👤";
  const parts = s.split(/\s+/).slice(0, 2);
  const letters = parts.map(p => (p[0] || "").toUpperCase()).join("");
  return letters || "👤";
}

function absUrl(u) {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;                 // already absolute
  const base = (API_BASE || "").replace(/\/+$/, "");     // strip trailing slash
  const path = String(u).startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

// Load overall progress from localStorage
const loadOverallProgress = () => {
  try {
    const storedProgress = localStorage.getItem('overall-learning-progress');
    console.log('Loading overall progress from localStorage:', storedProgress);
    if (storedProgress) {
      const progressValue = JSON.parse(storedProgress);
      setProgress(progressValue);
      return progressValue;
    }
    return 0;
  } catch (error) {
    console.error('Error loading overall progress:', error);
    return 0;
  }
};

// Calculate progress from all pathways
const calculateOverallProgress = () => {
  try {
    // Import pathways data to calculate progress
    const pathways = [
      // Java Pathway
      {
        slug: "java-dsa",
        levels: [
          { slug: "beginner", challenges: Array(5).fill(null) },
          { slug: "intermediate", challenges: Array(6).fill(null) },
          { slug: "expert", challenges: Array(10).fill(null) }
        ]
      },
      // HTML Pathway
      {
        slug: "html-fundamentals", 
        levels: [
          { slug: "beginner", challenges: Array(5).fill(null) },
          { slug: "intermediate", challenges: Array(4).fill(null) },
          { slug: "expert", challenges: Array(10).fill(null) }
        ]
      },
      // CSS Pathway
      {
        slug: "css",
        levels: [
          { slug: "beginner", challenges: Array(5).fill(null) },
          { slug: "intermediate", challenges: Array(5).fill(null) },
          { slug: "expert", challenges: Array(5).fill(null) }
        ]
      },
      // JavaScript Pathway
      {
        slug: "javascript",
        levels: [
          { slug: "beginner", challenges: Array(5).fill(null) },
          { slug: "intermediate", challenges: Array(5).fill(null) },
          { slug: "expert", challenges: Array(5).fill(null) }
        ]
      },
      // Python Pathway
      {
        slug: "python",
        levels: [
          { slug: "beginner", challenges: Array(5).fill(null) },
          { slug: "intermediate", challenges: Array(5).fill(null) },
          { slug: "expert", challenges: Array(5).fill(null) }
        ]
      },
      // Databases Pathway
      {
        slug: "databases",
        levels: [
          { slug: "beginner", challenges: Array(5).fill(null) },
          { slug: "intermediate", challenges: Array(5).fill(null) },
          { slug: "expert", challenges: Array(5).fill(null) }
        ]
      },
      // C# Pathway
      {
        slug: "csharp",
        levels: [
          { slug: "beginner", challenges: Array(5).fill(null) },
          { slug: "intermediate", challenges: Array(5).fill(null) },
          { slug: "expert", challenges: Array(5).fill(null) }
        ]
      }
    ];

    let totalChallenges = 0;
    let completedChallenges = 0;

    pathways.forEach(pathway => {
      pathway.levels.forEach(level => {
        const progress = localStorage.getItem(`progress-${pathway.slug}-${level.slug}`);
        const levelChallenges = level.challenges.length;
        totalChallenges += levelChallenges;
        
        if (progress) {
          const data = JSON.parse(progress);
          completedChallenges += data.completedCount || 0;
        }
      });
    });

    const overallProgress = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
    console.log('Calculated overall progress:', overallProgress, 'completed:', completedChallenges, 'total:', totalChallenges);
    return overallProgress;
  } catch (error) {
    console.error('Error calculating overall progress:', error);
    return 0;
  }
};

// Update progress periodically and on focus
useEffect(() => {
  // Load progress immediately
  const progressValue = loadOverallProgress();
  console.log('Initial progress load:', progressValue);
  
  // Also calculate from scratch to ensure accuracy
  const calculatedProgress = calculateOverallProgress();
  console.log('Calculated progress:', calculatedProgress);
  
  // Use the calculated progress if it's different from stored
  if (calculatedProgress !== progressValue) {
    setProgress(calculatedProgress);
    localStorage.setItem('overall-learning-progress', JSON.stringify(calculatedProgress));
  }

  // Update progress when window gains focus (user returns to tab)
  const handleFocus = () => {
    console.log('Window focused, updating progress...');
    const newProgress = calculateOverallProgress();
    setProgress(newProgress);
  };

  window.addEventListener('focus', handleFocus);
  
  // Update progress every 30 seconds while on dashboard
  const interval = setInterval(() => {
    const newProgress = calculateOverallProgress();
    if (newProgress !== progress) {
      console.log('Periodic progress update:', newProgress);
      setProgress(newProgress);
    }
  }, 30000);

  return () => {
    window.removeEventListener('focus', handleFocus);
    clearInterval(interval);
  };
}, []);



  /* =========================
     Load dashboard summary
     ========================= */
 useEffect(() => {
  (async () => {
    try {
      setLoadingSummary(true);
      const res = await fetch(`${API_BASE}/dashboard/summary`, { credentials: "include" });
      if (!res.ok) throw new Error("summary not ok");
      const data = await res.json();
      setServer((prev) => ({ ...prev, ...data }));

      if (data?.profile?.theme) {
        localStorage.setItem("theme", data.profile.theme);
      }
      if (data?.profile?.name) {
        setUserData((p) => ({ ...p, name: data.profile.name }));
        localStorage.setItem("name", data.profile.name);
      }
      if (data?.profile?.role) {
        const r = (data.profile.role || "student").toLowerCase();
        localStorage.setItem("role", r);
      }
      
      // Use local storage progress instead of server progress
      const localProgress = loadOverallProgress();
      setProgress(localProgress);

      // ⬇️ NEW: if lecturer/admin, get system overview metrics
      const r = (data?.profile?.role || "").toLowerCase();
      if (r === "lecturer" || r === "admin") {
        const o = await fetch(`${API_BASE}/dashboard/lecturer-overview`, { credentials: "include" });
        if (o.ok) {
          const overview = await o.json();
          setServer((prev) => ({ ...prev, overview }));
        }
      }
    } catch (e) {
      console.warn("summary load failed", e);
      // Still load local progress even if server fails
      const localProgress = loadOverallProgress();
      setProgress(localProgress);
    } finally {
      setLoadingSummary(false);
    }
  })();
}, []);


  /* =========================
     Style
     ========================= */
  const CSS = `
    :root{
      --bg:#0a0e1a; --surface:#0f1419; --surface-2:#141b26; --surface-3:#1a2332;
      --text:#e8f0ff; --muted:#9ca3b8;
      --brand:#00d4ff; --brand-2:#8b5cf6; --accent:#10b981; --danger:#ef4444;
      --warning:#f59e0b; --success:#10b981;
      --card:rgba(255,255,255,.04); --glass:rgba(255,255,255,.08);
      --shadow:0 25px 50px -12px rgba(0,0,0,.5);
      --shadow-lg:0 35px 60px -12px rgba(0,0,0,.7);
      --radius:20px; --radius-lg:32px; --sidebar:300px; --ring:#2a3441;
      --blur:blur(20px);
      --transition:all .3s cubic-bezier(.4,0,.2,1);
      --spring:cubic-bezier(.175,.885,.32,1.275);
    }
    .light{
      --bg:#f8fafc; --surface:#ffffff; --surface-2:#f1f5f9; --surface-3:#e2e8f0;
      --text:#0f172a; --muted:#64748b;
      --card:rgba(255,255,255,.9); --glass:rgba(255,255,255,.95);
      --ring:#e2e8f0;
      --shadow:0 25px 50px -12px rgba(0,0,0,.15);
      --shadow-lg:0 35px 60px -12px rgba(0,0,0,.25);
    }
    html, body, #root { height:100%; width:100%; margin:0; padding:0; font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    body { overflow-x:hidden; background:var(--bg); color:var(--text); line-height:1.6; }

    .app{ display:grid; grid-template-columns:minmax(80px, var(--sidebar)) 1fr; min-height:100vh; width:100vw; max-width:100vw;
      background:
        radial-gradient(1400px 800px at 10% -20%, rgba(0,212,255,0.15), transparent 50%),
        radial-gradient(1200px 600px at 90% 20%, rgba(139,92,246,0.12), transparent 50%),
        radial-gradient(800px 400px at 50% 80%, rgba(16,185,129,0.08), transparent 50%),
        linear-gradient(180deg, rgba(10,14,26,0.9), rgba(15,20,25,0.95)); }

    a{ color:inherit; text-decoration:none }

    /* Sidebar */
    .sidebar{ position:sticky; top:0; height:100vh; padding:24px 20px;
      border-right:1px solid rgba(255,255,255,.06);
      background: linear-gradient(135deg, rgba(15,20,25,0.95), rgba(26,35,50,0.8)),
                  linear-gradient(45deg, rgba(0,212,255,0.03), transparent 60%);
      backdrop-filter:saturate(180%) var(--blur);
      z-index:10; transition:var(--transition); }
    .brand{ display:flex; align-items:center; gap:12px; font-weight:900; letter-spacing:.5px; padding:16px 12px 32px; font-size:1.1rem;}
    .logo{ width:42px; height:42px; border-radius:14px;
      background:conic-gradient(from 210deg at 50% 50%, var(--brand), var(--brand-2), var(--accent));
      box-shadow:0 0 0 3px rgba(255,255,255,.08) inset, 0 8px 32px rgba(0,212,255,.2); }
    .side-title{ font-size:.75rem; letter-spacing:.15em; color:var(--muted); opacity:.8; margin:32px 12px 12px; font-weight:600 }
    .side-nav{ display:grid; gap:8px; margin-bottom:24px }
    .side-link{ display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:16px; color:var(--muted);
      border:1px solid transparent; transition:var(--transition); overflow:hidden; }
    .side-link:hover{ color:var(--text); background:var(--glass); border-color:rgba(255,255,255,.12); transform:translateX(4px) scale(1.02) }
    .side-link.active{ color:#0a0e1a; background:linear-gradient(90deg,var(--brand),var(--brand-2)); box-shadow:0 8px 32px rgba(0,212,255,.25); transform:translateX(4px) }
    .side-link span:first-child{ width:20px; text-align:center }

    /* Avatar */
/* Avatar (bigger) */
.avatar-lg{
  width:72px;           /* was 52px */
  height:72px;          /* was 52px */
  border-radius:18px;   /* slightly larger rounding */
  overflow:hidden;
  flex:0 0 72px;
  display:grid;
  place-items:center;
  font-weight:900;
  background:var(--surface-3);
  border:1px solid rgba(255,255,255,.12);
}
.avatar-lg img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

@media (max-width: 560px){
  .avatar-lg{ width:56px; height:56px; border-radius:14px; }
}



    /* Main */
    .main{ display:grid; grid-template-rows:auto 1fr; min-height:100vh; position:relative; z-index:2 }
    header.top{ position:sticky; top:0; z-index:20; backdrop-filter:saturate(180%) var(--blur);
      background:linear-gradient(135deg, rgba(15,20,25,0.9), rgba(26,35,50,0.7)); border-bottom:1px solid rgba(255,255,255,.08) }
    .topbar{ display:flex; align-items:center; justify-content:space-between; height:80px; padding:0 32px; gap:20px }
    .badge{ display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:999px;
      background:linear-gradient(90deg,var(--brand),var(--brand-2)); color:#0a0e1a; font-weight:800; font-size:.75rem; box-shadow:0 4px 20px rgba(0,212,255,.2) }

    .content{ padding:32px; max-width:1400px; margin:0 auto; width:100% }
    .grid{ display:grid; gap:24px }
    .card{ background:var(--card); border:1px solid rgba(255,255,255,.08); border-radius:var(--radius); padding:28px; box-shadow:var(--shadow);
      min-width:0; backdrop-filter:var(--blur); transition:var(--transition); position:relative; overflow:hidden }
    .card:hover{ transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:rgba(255,255,255,.15) }
    .muted{ color:var(--muted) }

    /* Center grid */
    .center{ display:grid; grid-template-columns:repeat(12, minmax(0,1fr)); gap:24px; align-items:start }
    .card--welcome{ grid-column:span 8 } .card--progress{ grid-column:span 4 }
    .card--system{ grid-column:span 8 }
    .card--notes{ grid-column:1 / -1 }   /* full width notifications */
    .card--resources, .card--stats{ grid-column:1 / -1 }

    /* Quick */
    .quick{ display:grid; gap:16px; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); margin-top:20px }
    .qa{ display:flex; gap:16px; align-items:flex-start; padding:20px; border-radius:18px; background:var(--surface-2); border:1px solid rgba(255,255,255,.1);
      transition:var(--spring); cursor:pointer }
    .qa:hover{ transform:translateY(-6px) scale(1.02); background:var(--surface-3); border-color:rgba(255,255,255,.2) }
    .qa .icon{ width:48px; height:48px; display:grid; place-items:center; border-radius:14px; background:linear-gradient(135deg,var(--brand),var(--brand-2));
      color:#0a0e1a; font-weight:900; font-size:1.2rem; box-shadow:0 8px 24px rgba(0,212,255,.2) }

    /* Ring */
    .ring{ width:200px; height:200px; display:grid; place-items:center; margin:24px auto; }
    .ring svg .pct{ font-weight:900; font-size:2rem; fill:var(--text); }

    .kpis{ display:grid; gap:20px; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); margin-top:20px }
    .kpi .big{ font-size:2.2rem; font-weight:900; }

    .files{ display:grid; gap:12px; margin-top:16px }
    .file{ display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px; border-radius:14px; background:var(--glass); border:1px solid rgba(255,255,255,.08) }

    .btn{ appearance:none; border:none; padding:12px 20px; border-radius:14px; font-weight:700; cursor:pointer; transition:var(--spring);
      box-shadow:0 4px 20px rgba(0,212,255,.15); background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:#0a0e1a }
    .btn.secondary{ background:var(--surface-2); border:1px solid rgba(255,255,255,.2); color:var(--text); box-shadow:0 4px 20px rgba(0,0,0,.1) }
    .btn.pill{ cursor:default; user-select:none } /* display-only look */

    .searchbar{ display:flex; gap:12px; align-items:center; background:var(--surface-2); border:1px solid rgba(255,255,255,.12); padding:14px 18px; border-radius:16px; width:100%; max-width:460px }

    /* AI Tutor / Enhanced Search */
    .ai-dock-toggle{
      position:fixed; right:24px; bottom:24px; z-index:60;
      border-radius:999px; padding:14px 16px; font-weight:800; cursor:pointer;
      background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:#0a0e1a; border:none;
      box-shadow:0 14px 40px rgba(0,0,0,.35);
    }
    .ai-panel{
      position:fixed; right:24px; bottom:24px; width:min(680px, 92vw); height:min(70vh, 760px);
      border-radius:20px; background:var(--card); border:1px solid rgba(255,255,255,.14);
      box-shadow:var(--shadow-lg); backdrop-filter:var(--blur); z-index:70; overflow:hidden; display:grid; grid-template-rows:auto 1fr auto;
      animation:pop .2s ease-out;
    }
    @keyframes pop{ from{ transform:translateY(12px) scale(.98); opacity:0 } to{ transform:none; opacity:1 } }
    .ai-head{
      display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; border-bottom:1px solid rgba(255,255,255,.08);
      background:linear-gradient(180deg, rgba(255,255,255,.04), transparent);
    }
    .ai-body{ overflow:auto; padding:14px; display:grid; gap:12px; align-content:start }
    .msg{ display:flex; gap:10px; align-items:flex-start }
    .msg.me .bubble{ background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:#0a0e1a }
    .avatar{ width:28px; height:28px; border-radius:999px; display:grid; place-items:center; background:var(--surface-3) }
    .bubble{ max-width:100%; padding:10px 12px; border-radius:14px; background:var(--surface-2); border:1px solid rgba(255,255,255,.1) }
    .ai-foot{ padding:12px; border-top:1px solid rgba(255,255,255,.08); display:grid; gap:10px }
    .prompt-row{ display:flex; gap:10px }
    .prompt-row textarea{ flex:1; resize:none; min-height:44px; max-height:160px; padding:10px 12px; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:var(--surface-2); color:var(--text); outline:none }
    .suggest{ display:flex; gap:8px; flex-wrap:wrap }
    .chip{ font-size:.9rem; padding:8px 10px; border-radius:999px; background:var(--surface-2); border:1px solid rgba(255,255,255,.1); cursor:pointer }
    .typing{ display:flex; gap:6px; align-items:center; color:var(--muted) }
    .dot{ width:6px; height:6px; border-radius:999px; background:currentColor; opacity:.6; animation:blink 1.2s infinite }
    .dot:nth-child(2){ animation-delay:.2s } .dot:nth-child(3){ animation-delay:.4s }
    @keyframes blink{ 0%, 80%, 100%{ opacity:.2 } 40%{ opacity:1 } }

    .md code{ background:rgba(255,255,255,.08); padding:.1rem .35rem; border-radius:6px }
    .md pre{ background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.08); padding:10px 12px; border-radius:12px; overflow:auto }
    .link-card{ border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:10px; margin-top:8px; background:var(--surface-2) }

    @media (max-width:1200px){ .center{ grid-template-columns:1fr }
      .card--welcome, .card--progress, .card--system, .card--notes, .card--resources, .card--stats{ grid-column:1 / -1 } }
  `;

  /* ========== PROGRESS RING ========== */
  const CIRC = 2 * Math.PI * 75;

  /* ========== FILES ========== */
 // Accept only ZIP up to 20MB; create editable pending entries
const onFiles = (e) => {
  const picked = Array.from(e.target.files || []);
  if (!picked.length) return;

  const MAX = 20 * 1024 * 1024; // 20MB
  const next = [];

  for (const f of picked) {
    const isZip =
      f.type === "application/zip" ||
      f.type === "application/x-zip-compressed" ||
      /\.zip$/i.test(f.name);

    if (!isZip) {
      next.push({ file: f, title: "", desc: "", error: "Only .zip files are allowed" });
      continue;
    }
    if (f.size > MAX) {
      next.push({ file: f, title: "", desc: "", error: "Max size is 20MB" });
      continue;
    }
    next.push({ file: f, title: f.name.replace(/\.zip$/i, ""), desc: "", error: null });
  }

  setPendingUploads((prev) => [...prev, ...next]);
  e.target.value = "";
};

const removePending = (idx) => {
  setPendingUploads((prev) => prev.filter((_, i) => i !== idx));
};

async function deleteResource(id) {
  try {
    const resp = await fetch(`${API_BASE}/api/resources/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || "Delete failed");

    // refresh client state: replace resources list, and (optional) update overview count
    if (Array.isArray(data.resources)) {
      setServer((prev) => ({ ...prev, resources: data.resources }));
    }
    // optional re-fetch overview to keep resourcesCount in sync
    const r = (server?.profile?.role || "").toLowerCase();
    if (r === "lecturer" || r === "admin") {
      const o = await fetch(`${API_BASE}/api/dashboard/lecturer-overview`, { credentials: "include" });
      if (o.ok) {
        const overview = await o.json();
        setServer((prev) => ({ ...prev, overview }));
      }
    }
  } catch (e) {
    alert(e.message || "Failed to delete");
  }
}

// helper to (re)load lecturer overview
async function fetchOverview() {
  try {
    const o = await fetch(`${API_BASE}/api/dashboard/lecturer-overview`, { credentials: "include" });
    if (o.ok) {
      const overview = await o.json();
      setServer((prev) => ({ ...prev, overview }));
    }
  } catch (e) {
    console.warn("overview load failed", e);
  }
}

// fetch latest lecturer/admin overview KPIs
async function refreshOverview() {
  try {
    const r = (server?.profile?.role || "").toLowerCase();
    if (r !== "lecturer" && r !== "admin") return;
    const o = await fetch(`${API_BASE}/api/dashboard/lecturer-overview`, { credentials: "include" });
    if (o.ok) {
      const overview = await o.json();
      setServer((prev) => ({ ...prev, overview }));
    }
  } catch (e) {
    console.warn("overview refresh failed", e);
  }
}


// auto-refresh overview whenever the list of resources changes
useEffect(() => {
  async function fetchOverview() {
    try {
      const o = await fetch(`${API_BASE}/api/dashboard/lecturer-overview`, { credentials: "include" });
      if (o.ok) {
        const overview = await o.json();
        setServer((prev) => ({ ...prev, overview }));
      }
    } catch (e) {
      console.warn("overview load failed", e);
    }
  }
  const r = (server?.profile?.role || "").toLowerCase();
  if (r === "lecturer" || r === "admin") fetchOverview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [server.resources?.length]);



async function uploadOne(pending, idx) {
  try {
    // mark uploading
    setPendingUploads((prev) =>
      prev.map((x, i) => (i === idx ? { ...x, uploading: true, error: null } : x))
    );

    const fd = new FormData();
    fd.append("file", pending.file);
    fd.append("title", pending.title || pending.file.name.replace(/\.zip$/i, ""));
    fd.append("description", pending.desc || "");

    const resp = await fetch(`${API_BASE}/api/resources/upload`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "Upload failed");
      throw new Error(errText || "Upload failed");
    }

    // Expect the API to return the created resource row
    const created = await resp.json();

    // Update server.resources list (prepend newest)
    setServer((s) => ({
      ...s,
      resources: [created, ...(s.resources || [])].slice(0, 20),
    }));

    // remove from pending
    setPendingUploads((prev) => prev.filter((_, i) => i !== idx));
  } catch (err) {
    setPendingUploads((prev) =>
      prev.map((x, i) =>
        i === idx ? { ...x, uploading: false, error: err.message || "Upload failed" } : x
      )
    );
  }
}

async function uploadAll() {
  if (!pendingUploads.length) return;
  setUploadingAll(true);
  // Upload sequentially to keep UI simple
  for (let i = 0; i < pendingUploads.length; i++) {
    // If item already errored and user didn't fix, skip
    const item = pendingUploads[i];
    if (item.error) continue;
    await uploadOne(item, i);
  }
  setUploadingAll(false);
}


  /* =========================================================
     AI (Enhanced Search) — STATE & UTILITIES
     ========================================================= */
  const [aiOpen, setAiOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("devlearn_chat") || "[]");
    } catch {
      return [];
    }
  });

  // Save chat
  useEffect(() => {
    localStorage.setItem("devlearn_chat", JSON.stringify(messages));
  }, [messages]);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, aiOpen]);

  // Tiny "markdown-ish" renderer
  const renderMarkdownish = (text) => {
    const blockParts = text.split(/```([\s\S]*?)```/g);
    const nodes = [];
    blockParts.forEach((part, i) => {
      if (i % 2 === 1) {
        nodes.push(
          <pre key={`pre-${i}`} className="md">
            <code>{part}</code>
          </pre>
        );
      } else {
        const withInline = [];
        const segments = part.split(/`([^`]+)`/g);
        segments.forEach((seg, j) => {
          if (j % 2 === 1) {
            withInline.push(<code key={`code-${i}-${j}`}>{seg}</code>);
          } else {
            const linked = seg
              .split(/(https?:\/\/[^\s)]+)|(\bwww\.[^\s)]+)/g)
              .map((frag, k) => {
                if (!frag) return null;
                if (frag.startsWith("http") || frag.startsWith("www")) {
                  const href = frag.startsWith("http") ? frag : `https://${frag}`;
                  return (
                    <a key={`a-${i}-${j}-${k}`} href={href} target="_blank" rel="noreferrer">
                      {frag}
                    </a>
                  );
                }
                return <span key={`t-${i}-${j}-${k}`}>{frag}</span>;
              });
            withInline.push(<span key={`span-${i}-${j}`}>{linked}</span>);
          }
        });
        nodes.push(
          <div key={`div-${i}`} className="md">
            {withInline}
          </div>
        );
      }
    });
    return nodes;
  };

  // Suggested prompts (role-aware)
  const suggestions = useMemo(() => {
    if (role === "lecturer" || role === "admin") {
      return [
        "Create a weekly roadmap for Data Structures (4 weeks).",
        "Generate a rubric for a JavaScript project assessment.",
        "Suggest 5 high-quality GitHub repos for teaching React hooks.",
        "Draft a brief on academic integrity for first-years.",
      ];
    }
    return [
      "Explain closures in JavaScript with a short example.",
      "How to structure a study plan for Algorithms (4 weeks)?",
      "Recommend YouTube videos for async/await in JS.",
      "Debug: my React state isn't updating after setState.",
    ];
  }, [role]);

  // Demo AI backend
  async function callAiBackend(userText, ctx) {
    const resp = await fetch("http://localhost:8787/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localStorage.getItem("freeTutorUserId") || undefined,
        user: { name: ctx?.name || "Student", role: ctx?.role || "student" },
        message: userText,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "API error");
    if (data.userId) localStorage.setItem("freeTutorUserId", data.userId);
    return { text: data.reply, links: data.links };
  }

async function callAiBackendStream(userText, ctx, onDelta, onFinal) {
  const resp = await fetch("http://localhost:3001/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      message: userText,
    }),
  });
  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || "Streaming API error");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Split by newline (NDJSON)
    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      try {
        const evt = JSON.parse(line);
        if (evt.type === "token" && typeof evt.delta === "string") {
          onDelta(evt.delta);
        } else if (evt.type === "final") {
          if (evt.userId) localStorage.setItem("freeTutorUserId", evt.userId);
          onFinal({ text: evt.reply || "", links: evt.links || [] });
        }
      } catch {
        // ignore malformed chunks
      }
    }
  }
}

  // Send handler
  const send = async (text) => {
  const content = (text ?? input).trim();
  if (!content) return;

  // 1) push the user message
  setMessages((m) => [...m, { role: "user", content, ts: Date.now() }]);
  setInput("");
  setTyping(true);

  // 2) create a placeholder assistant message we'll mutate as tokens arrive
  const draftIndexRef = { i: null };
  setMessages((m) => {
    const i = m.length;
    draftIndexRef.i = i;
    return [...m, { role: "assistant", content: "", ts: Date.now(), links: [] }];
  });

  try {
    const ctx = { role, name: userData.name };
    let assembled = "";

    await callAiBackendStream(
      content,
      ctx,
      // onDelta
      (delta) => {
        assembled += delta;
        setMessages((m) => {
          const copy = m.slice();
          const i = draftIndexRef.i ?? copy.length - 1;
          const msg = { ...copy[i] };
          msg.content += delta;
          copy[i] = msg;
          return copy;
        });
      },
      // onFinal
      ({ text, links }) => {
        setMessages((m) => {
          const copy = m.slice();
          const i = draftIndexRef.i ?? copy.length - 1;
          const msg = { ...copy[i] };
          msg.content = text || assembled;
          msg.links = links || [];
          copy[i] = msg;
          return copy;
        });
      }
    );
  } catch (e) {
    setMessages((m) => [...m, { role: "assistant", content: "Sorry — streaming failed. Try again.", ts: Date.now() }]);
  } finally {
    setTyping(false);
  }
};

  /* =========================
     Server-backed derived data
     ========================= */
  const quickLinks = (server.quickLinks?.length ? server.quickLinks : []).map((l) => ({
    icon: l.Icon || "🧭",
    title: l.Title,
    desc: l.Desc,
    href: l.Href || "#",
  }));

  const notifications = (server.notifications?.length ? server.notifications : []).map((n) => ({
    id: n.Id,
    t: n.Title,
    body: n.Body,
    when: new Date(n.CreatedAt).toLocaleString(),
    type: n.Type,
  }));

  return (
    <div className={`app ${theme}`}>
      <style>{CSS}</style>

      {/* Sidebar */}
      <aside className="sidebar" aria-label="Main sidebar">
        <div className="brand">
          <span className="logo" /> <span>DevLearn</span>
        </div>

        <div className="side-title">OVERVIEW</div>
        <nav className="side-nav" aria-label="Sidebar">
  <Link className={isActive("/dashboard")} to="/dashboard">
    <span>🏠</span>
    <span className="label">Dashboard</span>
  </Link>

  {/* keep placeholders as plain anchors until you add routes */}
  <Link className={isActive("/PathwayPage")} to="/PathwayPage">
  <span>🧩</span>
  <span className="label">Learning Pathways</span>
</Link>
    <Link className={isActive("/community")} to="/community">
  <span>🧩</span>
  <span className="label">Community</span>
</Link>
  <Link className={isActive("/resources")} to="/resources">
  <span>🧩</span>
  <span className="label">Resources</span>
</Link>
</nav>

<div className="side-title">ACCOUNT</div>
<nav className="side-nav">
  <Link className={isActive("/profile")} to="/profile">
    <span>👤</span>
    <span className="label">Profile</span>
  </Link>
  
</nav>

      </aside>

      {/* Main */}
      <section className="main">
        <header className="top">
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              
              <strong style={{ fontSize: "1.2rem" }}>Dashboard</strong>
              {loadingSummary && <span className="muted" style={{ marginLeft: 12 }}>(loading…)</span>}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 680 }}>
              <div className="searchbar" role="search" style={{ flex: 1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input placeholder="Search snippets, modules, people…" aria-label="Search" />
              </div>
              {/* Role is display-only now */}
              <span className="btn secondary pill" aria-label="Current role">
                👤 {role[0].toUpperCase() + role.slice(1)}
              </span>
            </div>
          </div>
        </header>

        <div className="content">
          <div className="center">
            {/* Welcome + Quick */}
            <section className="card card--welcome" aria-label="Welcome">
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
    <div className="avatar-lg" aria-hidden="true">
  {server.profile?.avatarUrl ? (
    <img src={absUrl(server.profile.avatarUrl)} alt="Avatar" />
  ) : (
    <span>{initialsFrom(server.profile?.name || userData.name)}</span>
  )}
</div>

    <div>
      <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>
        Welcome back, {(server.profile?.name || userData.name)}! 👋
      </h2>
      <p className="muted" style={{ marginTop: 4, fontSize: "1.05rem" }}>
        Here's your learning snapshot and what's next on your roadmap.
      </p>
    </div>
  </div>
  {/* (keep the rest of the Welcome card content, e.g. quick links) */}

<div className="quick">
  {quickLinks.length > 0 ? (
    quickLinks.map((q, idx) => (
      <a key={idx} className="qa" href={q.href || "#"}>
        <div className="icon">{q.icon || "🧭"}</div>
        <div style={{ minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: "1.1rem" }}>{q.title}</strong>
          {q.desc && (
            <div className="muted" style={{ fontSize: ".95rem", marginTop: 4 }}>{q.desc}</div>
          )}
        </div>
      </a>
    ))
  ) : (
    <div
      className="qa"
      style={{
        justifyContent: "center",
        textAlign: "center",
        borderStyle: "dashed",
      }}
      aria-live="polite"
    >
      <div style={{ minWidth: 0 }}>
        <strong style={{ display: "block", fontSize: "1.1rem" }}>
          Your schedule is clear 🎉
        </strong>
        <div className="muted" style={{ fontSize: ".95rem", marginTop: 4 }}>
          No upcoming items. Enjoy the free time or add new quick links later.
        </div>
      </div>
    </div>
  )}
</div>

            </section>

            {/* Progress (no +/- controls) */}
            <section className="card card--progress" aria-label="Progress tracking">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>Your Progress</h3>
                  <div className="muted" style={{ fontSize: "1rem", marginTop: 4 }}>Overall completion across all pathways</div>
                </div>
              </div>

              <div className="ring">
                <svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label={`Progress ${progress}%`}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="75" fill="none" stroke="var(--ring)" strokeWidth="12" />
                  <circle
                    cx="100" cy="100" r="75" fill="none" stroke="url(#grad)" strokeWidth="12"
                    strokeLinecap="round" strokeDasharray={`${(progress / 100) * CIRC} ${CIRC}`}
                    transform="rotate(-90 100 100)" style={{ transition: "stroke-dasharray 0.6s ease-in-out" }}
                  />
                  <text x="100" y="108" textAnchor="middle" className="pct">{progress}%</text>
                </svg>
              </div>

              {progress === 100 && (
                <div
                  style={{
                    textAlign: "center", marginTop: 16, padding: "12px 16px",
                    background: "linear-gradient(90deg, var(--accent), var(--brand))",
                    borderRadius: "12px", color: "#0a0e1a", fontWeight: 700,
                  }}
                >
                  🎉 Congratulations! You've completed everything!
                </div>
              )}
              
              {progress > 0 && progress < 100 && (
                <div
                  style={{
                    textAlign: "center", marginTop: 16, padding: "12px 16px",
                    background: "var(--surface-2)",
                    borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Keep going! 🚀</div>
                  <div className="muted" style={{ fontSize: "0.9rem", marginTop: 4 }}>
                    Continue learning in the Pathways section
                  </div>
                </div>
              )}
            </section>

            {/* System Overview (lecturer/admin) */}
            {/* System Overview (lecturer/admin) */}
{(role === "admin" || role === "lecturer") && (
  <section
    className="card card--system"
    aria-label="System overview"
    style={{ gridColumn: "1 / -1" }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>System Overview</h3>
        <div className="muted" style={{ fontSize: "1rem", marginTop: 4 }}>Live platform metrics</div>
      </div>

      {/* Tabs */}

    </div>





  {/* NEW */}
  <div className="kpis">
  <div className="card kpi" style={{ padding: 20 }}>
    <div className="muted" style={{ fontSize: "0.9rem" }}>Active Users</div>
    <div className="big">{server.overview?.activeUsers7d ?? 0}</div>
  </div>
  <div className="card kpi" style={{ padding: 20 }}>
    <div className="muted" style={{ fontSize: "0.9rem" }}>Modules</div>
    <div className="big">{server.overview?.modulesCount ?? 0}</div>
  </div>
  <div className="card kpi" style={{ padding: 20 }}>
    <div className="muted" style={{ fontSize: "0.9rem" }}>Code Snippets</div>
    <div className="big">{server.overview?.snippetsCount ?? 0}</div>
  </div>
  {/* NEW: Active Files */}

</div>


  </section>
)}


            {/* Notifications (full width, dismiss only) */}
            <section className="card card--notes" aria-label="Notifications">
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>Notifications</h3>
                <div className="muted" style={{ fontSize: "1rem", marginTop: 4 }}>Recent updates</div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {notifications.length === 0 && <div className="muted">No new notifications.</div>}
                {notifications.map((n, i) => (
                  <div key={n.id ?? i} className="note" style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: "1.2rem", marginTop: 2 }}>
                        {n.type === "info" && "💡"}
                        {n.type === "success" && "🎉"}
                        {n.type === "warning" && "⚠️"}
                        {!["info","success","warning"].includes((n.type||"").toLowerCase()) && "🔔"}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "1rem", lineHeight: 1.4 }}>{n.t}</div>
                        {n.body && <div className="muted" style={{ fontSize: ".95rem", marginTop: 4 }}>{n.body}</div>}
                        <div className="muted" style={{ fontSize: "0.85rem", marginTop: 4 }}>{n.when}</div>
                      </div>
                    </div>
                    <button
                      className="btn secondary"
                      style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!n.id) return;
                        try {
                          await fetch(`${API_BASE}/api/notifications/${n.id}/dismiss`, {
                            method: "POST",
                            credentials: "include",
                          });
                          setServer((s) => ({
                            ...s,
                            notifications: s.notifications.filter((x) => x.Id !== n.id),
                          }));
                        } catch {}
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Resources (lecturer/admin) */}
           {(role === "admin" || role === "lecturer") && (
  <section className="card card--resources" aria-label="Resource upload">
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>Resources</h3>
      <div className="muted" style={{ fontSize: "1rem", marginTop: 4 }}>
        Upload ZIP teaching materials (max 20MB), add a title & description.
      </div>
    </div>

    <div
      style={{
        border: "2px dashed rgba(255,255,255,.2)",
        borderRadius: "16px",
        padding: "24px",
        textAlign: "center",
        background: "var(--surface-2)",
        marginBottom: 20,
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>📁</div>
      <input
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        multiple
        onChange={onFiles}
        style={{
          width: "100%",
          padding: "8px",
          background: "transparent",
          border: "none",
          color: "var(--text)",
          cursor: "pointer",
        }}
      />
      <div className="muted" style={{ fontSize: "0.9rem", marginTop: 8 }}>
        Drag ZIPs here or click to browse
      </div>
    </div>

    {/* Pending uploads editor */}
    {pendingUploads.length > 0 && (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <strong>Pending Uploads ({pendingUploads.length})</strong>
          <button className="btn" onClick={uploadAll} disabled={uploadingAll}>
            {uploadingAll ? "Uploading…" : "📤 Upload All"}
          </button>
        </div>

        <div className="files">
          {pendingUploads.map((p, idx) => (
            <div key={`${p.file.name}-${idx}`} className="file" style={{ alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "1.2rem" }}>📦</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.file.name} <small className="muted">({(p.file.size / 1024).toFixed(1)} KB)</small>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginTop: 8 }}>
                    <input
                      type="text"
                      placeholder="Title"
                      value={p.title}
                      onChange={(e) =>
                        setPendingUploads((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x))
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,.15)",
                        background: "var(--surface-3)",
                        color: "var(--text)",
                      }}
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={p.desc}
                      onChange={(e) =>
                        setPendingUploads((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, desc: e.target.value } : x))
                        )
                      }
                      rows={2}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,.15)",
                        background: "var(--surface-3)",
                        color: "var(--text)",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {p.error && (
                    <div style={{ color: "var(--danger)", marginTop: 6, fontSize: ".9rem" }}>
                      {p.error}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <button
                  className="btn"
                  onClick={() => uploadOne(p, idx)}
                  disabled={p.uploading}
                  style={{ padding: "8px 12px" }}
                >
                  {p.uploading ? "Uploading…" : "Upload"}
                </button>
                <button
                  className="btn secondary"
                  onClick={() => removePending(idx)}
                  disabled={p.uploading}
                  style={{ padding: "8px 12px" }}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Already-uploaded list (server-backed) */}
<div style={{ marginTop: 8 }}>
  <strong>Recent uploads</strong>
  <div className="files" style={{ marginTop: 10 }}>
    {(server.resources || []).length === 0 ? (
      <div className="muted">No resources uploaded yet.</div>
    ) : (
      (server.resources || []).map((r) => (
        <div key={r.Id} className="file">
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: "1.2rem" }}>📦</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.Title} <small className="muted">({r.FileName})</small>
              </div>
              {r.Description && (
                <small className="muted" style={{ display: "block", marginTop: 4 }}>
                  {r.Description}
                </small>
              )}
              <small className="muted">
                {(r.FileSizeBytes / 1024).toFixed(1)} KB • {new Date(r.CreatedAt).toLocaleString()}
              </small>
            </div>
          </div>

          {/* NEW: delete button */}
          <button
            className="btn secondary"
            onClick={() => deleteResource(r.Id)}
            style={{ padding: "6px 12px", fontSize: ".9rem" }}
            aria-label={`Delete ${r.Title || r.FileName}`}
          >
            🗑 Delete
          </button>
        </div>
      ))
    )}
  </div>
</div>

  </section>
)}


            {/* Student stats (still demo UI) */}
            {role === "student" && (
  <section className="card card--stats" aria-label="Study statistics">
    <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, marginBottom: 20 }}>
      Study Statistics
    </h3>

    {!server.stats?.length ? (
      <div className="muted">No study stats yet — once you start learning, your progress will appear here.</div>
    ) : (
      <div style={{ display: "grid", gap: 16 }}>
        <StatRow
          icon="📊"
          title="Study Streak"
          sub="Current streak"
          value={`${latest("StreakDays", 0)} days`}
          color="var(--accent)"
          hint={`Avg. success ${fmtPercent(avgLast7("SuccessRatePct", 0))} (7-day avg)`}
        />

        <StatRow
          icon="⏱️"
          title="Time Spent"
          sub="Today"
          value={fmtMinutes(latest("TimeSpentMinutes", 0))}
          color="var(--brand)"
          hint={`7-day avg: ${fmtMinutes(avgLast7("TimeSpentMinutes", 0))}`}
        />

        <StatRow
          icon="🏆"
          title="Completed"
          sub="Assignments (7 days)"
          value={`${Math.round(avgLast7("AssignmentsDone", 0))} avg/day`}
          color="var(--brand-2)"
          hint={`Latest success ${fmtPercent(latest("SuccessRatePct", 0))}`}
        />
      </div>
    )}
  </section>
)}

          </div>

          <footer className="muted" style={{ marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div>© {new Date().getFullYear()} DevLearn Platform</div>
              <div>•</div>
              <div>Empowering developers worldwide</div>
            </div>
          </footer>
        </div>
      </section>

      {/* === Enhanced Search Toggle (renamed) === */}
      {!aiOpen && (
        <button className="ai-dock-toggle" onClick={() => setAiOpen(true)} aria-label="Open Enhanced Search">
          🔎 AI Tutor
        </button>
      )}

      {/* === Enhanced Search Panel (renamed) === */}
      {aiOpen && (
        <div className="ai-panel" role="dialog" aria-label="Enhanced Search">
          <div className="ai-head">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar">🔎</div>
              <div>
                <strong>AI Tutor</strong>
                <div className="muted" style={{ fontSize: ".85rem" }}>
                  Ask questions, find resources, get help
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn secondary"
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem("devlearn_chat");
                }}
              >
                🗑 Clear
              </button>
              <button className="btn secondary" onClick={() => setAiOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="ai-body" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="note">
                <div>
                  <strong>Tip:</strong> Ask me about code, debugging, or a study plan. Try a suggestion below.
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "me" : ""}`}>
                <div className="avatar">{m.role === "user" ? "🧑" : "🔎"}</div>
                <div className="bubble">
                  <div className="md">{renderMarkdownish(m.content)}</div>
                  {Array.isArray(m.links) && m.links.length > 0 && (
                    <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                      {m.links.map((l, k) => (
                        <a key={k} className="link-card" href={l.url} target="_blank" rel="noreferrer">
                          <strong>{l.title}</strong>
                          <div className="muted" style={{ fontSize: ".9rem" }}>{l.desc}</div>
                          <div className="muted" style={{ fontSize: ".8rem" }}>{l.url}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="typing">
                <span>AI is thinking</span>
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )}
          </div>

          <div className="ai-foot">
            <div className="suggest" aria-label="Suggested prompts">
              {suggestions.map((s, idx) => (
                <button key={idx} className="chip" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>

            <form
              className="prompt-row"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  role === "student"
                    ? "Ask about code, debugging, study plans…"
                    : "Ask for rubrics, module plans, learning materials…"
                }
                rows={1}
              />
              <button className="btn" type="submit" disabled={!input.trim() || typing}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Small presentational row ===== */
function StatRow({ icon, title, sub, value, color, hint }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: "var(--surface-2)",
        borderRadius: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <div className="muted" style={{ fontSize: "0.9rem" }}>{sub}</div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color }}>{value}</div>
        <div className="muted" style={{ fontSize: "0.8rem" }}>{hint}</div>
      </div>
    </div>
  );
}