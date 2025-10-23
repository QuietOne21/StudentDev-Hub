// src/Profile.jsx - Enhanced with proper API usage and better error handling
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, absUrl } from "./api";

export default function Profile() {
  const navigate = useNavigate();

  // Server-loaded profile
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
    theme: "dark",
    avatarUrl: "",
  });

  // Editable fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Resources (user uploads)
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Avatar upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Load profile + recent resources
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("📥 Loading profile data...");
        const result = await api.getDashboardSummary();
        
        if (!result.ok) {
          throw new Error(result.error || "Failed to load profile");
        }

        const data = result.data;
        console.log("✅ Profile data loaded:", data);

        const profileData = {
          id: data?.profile?.id ?? null,
          name: data?.profile?.name ?? "",
          email: data?.profile?.email ?? "",
          role: (data?.profile?.role ?? "").toLowerCase(),
          theme: (data?.profile?.theme ?? "dark").toLowerCase(),
          avatarUrl: data?.profile?.avatarUrl || "",
        };

        setProfile(profileData);
        setName(profileData.name || "");
        setEmail(profileData.email || "");

        // Cache user data in localStorage
        if (profileData.name) localStorage.setItem("name", profileData.name);
        if (profileData.theme) localStorage.setItem("theme", profileData.theme);
        if (profileData.role) localStorage.setItem("role", profileData.role);

      } catch (err) {
        console.error("❌ Profile load error:", err);
        setError(err.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Load full file list for this user (manage uploads)
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoadingFiles(true);
        console.log("📥 Loading user files...");
        
        const result = await api.getResources();
        if (result.ok) {
          console.log(`✅ Loaded ${result.data.length} files`);
          setFiles(result.data || []);
        } else {
          console.warn("⚠️ Could not load files:", result.error);
        }
      } catch (err) {
        console.error("❌ Files load error:", err);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, []);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const initials = useMemo(() => {
    const nameStr = (profile.name || name || "").trim();
    if (!nameStr) return "👤";
    const parts = nameStr.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase() ?? "").join("") || "👤";
  }, [name, profile.name]);

  // Enhanced handler functions using api methods
  const handleResetPassword = async () => {
    const currentPassword = prompt("Enter your current password:");
    if (!currentPassword) return;
    
    const newPassword = prompt("Enter your new password (min 8 chars):");
    if (!newPassword) return;

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setError("");
      const result = await api.updatePassword({ currentPassword, newPassword });
      
      if (!result.ok) {
        throw new Error(result.error || "Password change failed");
      }
      
      showToast("✅ Password updated successfully");
    } catch (err) {
      setError(err.message || "Password change failed");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const saveProfileBasics = async () => {
    setError("");
    try {
      setSavingProfile(true);
      console.log("💾 Saving profile basics...");
      
      const result = await api.updateProfile({ name: name?.trim() || null });
      
      if (!result.ok) {
        throw new Error(result.error || "Failed to save changes");
      }

      const updatedName = result.data?.display_name || name || profile.name;
      setProfile(prev => ({ ...prev, name: updatedName }));
      localStorage.setItem("name", updatedName);
      
      showToast("✅ Profile updated successfully");
    } catch (err) {
      console.error("❌ Profile save error:", err);
      setError(err.message || "Save failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveEmail = async () => {
    setError("");
    try {
      setSavingEmail(true);
      console.log("📧 Updating email...");
      
      const result = await api.updateEmail(email.trim());
      
      if (!result.ok) {
        throw new Error(result.error || "Failed to update email");
      }

      setProfile(prev => ({ ...prev, email: result.data?.email || email }));
      showToast("✅ Email updated successfully");
    } catch (err) {
      console.error("❌ Email update error:", err);
      setError(err.message || "Email update failed");
    } finally {
      setSavingEmail(false);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setError("");
    try {
      setAvatarUploading(true);
      console.log("🖼️ Uploading avatar...");
      
      const formData = new FormData();
      formData.append("file", avatarFile);
      
      const result = await api.uploadAvatar(formData);
      
      if (!result.ok) {
        throw new Error(result.error || "Avatar upload failed");
      }

      const avatarUrl = result.data?.avatarUrl || "";
      setProfile(prev => ({ ...prev, avatarUrl }));
      showToast("✅ Profile picture updated");
      setAvatarFile(null);
    } catch (err) {
      console.error("❌ Avatar upload error:", err);
      setError(err.message || "Avatar upload failed");
    } finally {
      setAvatarUploading(false);
    }
  };

  const deleteAccount = async () => {
    setError("");
    try {
      console.log("🗑️ Deleting account...");
      
      const result = await api.deleteAccount();
      
      if (!result.ok) {
        throw new Error(result.error || "Account deletion failed");
      }
      
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("❌ Account deletion error:", err);
      setError(err.message || "Could not delete account");
      setConfirmDeleteOpen(false);
    }
  };

  const deleteFile = async (id) => {
    if (!id) return;
    setDeletingId(id);
    try {
      console.log(`🗑️ Deleting file ${id}...`);
      
      const result = await api.deleteResource(id);
      
      if (!result.ok) {
        throw new Error(result.error || "Delete failed");
      }
      
      setFiles(prev => prev.filter(f => f.id !== id));
      showToast("✅ File deleted successfully");
    } catch (err) {
      console.error("❌ File deletion error:", err);
      setError(err.message || "Could not delete file");
    } finally {
      setDeletingId(null);
    }
  };

  // Enhanced CSS with better responsive design
  const THEME = `
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
    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root { 
      height:100%; 
      background: var(--bg);
    }
    body { 
      background:var(--bg); 
      color:var(--text); 
      font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; 
      display: flex;
      justify-content: center;
      margin: 0;
      line-height: 1.6;
    }

    .wrap { 
      width: 100%;
      max-width: min(1200px, 95vw);
      min-height:100vh; 
      display:flex; 
      flex-direction:column;
      background: var(--bg);
    }
    
    header.top {
      position:sticky; 
      top:0; 
      z-index:10;
      background:linear-gradient(135deg, rgba(15,20,25,0.9), rgba(26,35,50,0.7));
      border-bottom:1px solid rgba(255,255,255,.08);
      backdrop-filter:saturate(180%) var(--blur);
      width: 100%;
    }
    
    .topbar { 
      height:72px; 
      display:flex; 
      align-items:center; 
      justify-content: center;
    }
    
    .topbar-inner { 
      width: 100%;
      max-width: min(1200px, 95vw);
      display:flex; 
      align-items:center; 
      justify-content:space-between; 
      padding:0 24px; 
    }

    /* MAIN CONTAINER */
    .container {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      gap: 24px;
      background: var(--bg);
    }

    /* All content blocks centered */
    .block {
      width: 100%;
    }

    /* Hero card */
    .hero{
      display:flex;
      align-items:center;
      gap:20px;
      padding: 24px;
    }

    /* Two columns */
    .columns{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:24px;
      width: 100%;
    }
    
    @media (max-width: 768px){
      .columns{ grid-template-columns: 1fr; }
      .hero{ flex-direction: column; text-align: center; }
    }

    .card{
      background:var(--card);
      border:1px solid rgba(255,255,255,.08);
      border-radius:var(--radius);
      box-shadow:var(--shadow);
      padding:24px;
      backdrop-filter:var(--blur);
      transition:var(--transition);
      width: 100%;
    }
    
    .card:hover{ 
      transform:translateY(-3px); 
      box-shadow:var(--shadow-lg); 
      border-color:rgba(255,255,255,.15); 
    }

    .sectionTitle { font-size:1.25rem; font-weight:700; margin:0 0 8px 0; }
    .muted { color:var(--muted); font-size: 0.9rem; }

    .row { display:grid; gap:16px; margin-top:16px; }
    .field { display:grid; gap:8px; }
    .label { font-size:.9rem; color:var(--muted); font-weight: 500; }
    
    .input, .textarea {
      width:100%; 
      padding:12px 16px; 
      background:var(--surface-2); 
      color:var(--text);
      border:1px solid rgba(255,255,255,.12); 
      border-radius:12px; 
      outline:none;
      font-size: 1rem;
      transition: var(--transition);
    }

    .input:focus, .textarea:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }

    .btnRow { display:flex; gap:12px; flex-wrap:wrap; margin-top:16px; }
    
    .btn {
      appearance:none; 
      border:none; 
      padding:12px 20px; 
      border-radius:12px; 
      font-weight:600; 
      cursor:pointer;
      background:linear-gradient(135deg, var(--brand), var(--brand-2)); 
      color:#0a0e1a; 
      box-shadow:0 4px 18px rgba(0,212,255,.18);
      transition:var(--spring);
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn.secondary{ 
      background:var(--surface-2); 
      border:1px solid rgba(255,255,255,.2); 
      color:var(--text); 
      box-shadow:none; 
    }
    
    .btn.danger{ 
      background:linear-gradient(135deg, #f43f5e, #ef4444); 
      color:white; 
    }
    
    .btn:disabled{ 
      opacity:.6; 
      cursor:not-allowed; 
      transform: none !important;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,212,255,.25);
    }

    .avatar {
      width:96px; 
      height:96px; 
      border-radius:24px; 
      display:grid; 
      place-items:center;
      background:linear-gradient(135deg, var(--brand), var(--brand-2)); 
      color:#0a0e1a;
      font-weight:700; 
      font-size:1.8rem; 
      box-shadow:0 10px 30px rgba(0,212,255,.25);
      user-select:none; 
      overflow:hidden;
      flex-shrink: 0;
    }
    
    .avatar img { 
      width:100%; 
      height:100%; 
      object-fit:cover; 
    }

    .badge { 
      display:inline-flex; 
      align-items:center; 
      gap:8px; 
      padding:6px 12px; 
      border-radius:999px;
      background:linear-gradient(90deg,var(--brand),var(--brand-2)); 
      color:#0a0e1a; 
      font-weight:600; 
      font-size:.75rem; 
      text-decoration: none;
    }

    .badge:hover {
      text-decoration: none;
      opacity: 0.9;
    }

    .toast {
      position:fixed; 
      right:24px; 
      bottom:24px; 
      z-index:60; 
      padding:12px 16px;
      border-radius:12px; 
      background:var(--surface-3); 
      border:1px solid rgba(255,255,255,.12);
      box-shadow:var(--shadow-lg);
      font-weight: 500;
    }
    
    .error { 
      background: var(--danger);
      color: white;
    }

    .success {
      background: var(--success);
      color: white;
    }

    /* Files list */
    .file { 
      display:flex; 
      justify-content:space-between; 
      align-items:center; 
      gap:16px; 
      padding:16px;
      border-radius:12px; 
      background:var(--surface-2); 
      border:1px solid rgba(255,255,255,.08); 
      transition: var(--transition);
    }
    
    .file:hover {
      background: var(--surface-3);
      border-color: rgba(255,255,255,.12);
    }
    
    .files { 
      display:grid; 
      gap:12px; 
      margin-top:16px; 
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: var(--muted);
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--muted);
      border-top: 2px solid var(--brand);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 12px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const themeClass = (profile.theme || "dark") === "light" ? "light" : "";

  if (loading) {
    return (
      <div className={`wrap ${themeClass}`}>
        <style>{THEME}</style>
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className={`wrap ${themeClass}`}>
      <style>{THEME}</style>

      <header className="top">
        <div className="topbar">
          <div className="topbar-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link to="/dashboard" className="badge">🏠 Dashboard</Link>
              <span className="muted" style={{ marginLeft: 10, fontSize: ".95rem" }}>
                Profile & Account
              </span>
            </div>
            <div className="muted">
              {profile.role === "lecturer" ? "👨‍🏫 Lecturer" :
               profile.role === "admin" ? "🛡️ Admin" : "👩‍🎓 Student"}
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Hero Section */}
        <div className="block">
          <div className="card hero">
            <div className="avatar" aria-hidden="true">
              {profile.avatarUrl ? (
                <img src={absUrl(profile.avatarUrl)} alt="Profile" />
              ) : (
                initials
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <h2 className="sectionTitle" style={{ margin: 0 }}>
                  {name || profile.name || "Your Name"}
                </h2>
                {profile.role && (
                  <span className="badge" title={`Role: ${profile.role}`}>
                    {profile.role === "lecturer" ? "👨‍🏫 Lecturer" :
                     profile.role === "admin" ? "🛡️ Admin" : "👩‍🎓 Student"}
                  </span>
                )}
              </div>
              <div className="muted" style={{ overflowWrap: "anywhere" }}>
                {email || profile.email || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="block">
          <div className="columns">
            {/* Left Column: Profile Basics + Avatar */}
            <section className="card" aria-labelledby="basics-heading">
              <h3 id="basics-heading" className="sectionTitle">Profile Settings</h3>
              <p className="muted">Update your public profile information</p>

              <div className="row">
                <div className="field">
                  <label className="label" htmlFor="display-name">Display Name</label>
                  <input
                    id="display-name"
                    className="input"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="btnRow">
                  <button 
                    className="btn" 
                    onClick={saveProfileBasics} 
                    disabled={savingProfile || !name.trim()}
                  >
                    {savingProfile ? "⏳ Saving..." : "💾 Save Changes"}
                  </button>
                  <Link to="/dashboard" className="btn secondary">← Back to Dashboard</Link>
                </div>
              </div>

              <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,.08)", margin: "20px 0" }} />

              <h4 className="sectionTitle" style={{ fontSize: "1rem" }}>Profile Picture</h4>
              <div className="row">
                <div className="field">
                  <input
                    className="input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                  <div className="muted" style={{ fontSize: ".85rem" }}>
                    Recommended: Square image, max 5MB
                  </div>
                </div>
                <div className="btnRow">
                  <button 
                    className="btn" 
                    onClick={uploadAvatar} 
                    disabled={!avatarFile || avatarUploading}
                  >
                    {avatarUploading ? "⏳ Uploading..." : "🖼️ Upload Avatar"}
                  </button>
                  {avatarFile && (
                    <button className="btn secondary" onClick={() => setAvatarFile(null)}>
                      ❌ Clear
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Right Column: Account Settings */}
            <section className="card" aria-labelledby="account-heading">
              <h3 id="account-heading" className="sectionTitle">Account Settings</h3>
              <p className="muted">Manage your email and account preferences</p>

              <div className="row">
                <div className="field">
                  <label className="label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="btnRow">
                    <button 
                      className="btn" 
                      onClick={saveEmail} 
                      disabled={savingEmail || !email.trim() || email === profile.email}
                    >
                      {savingEmail ? "⏳ Updating..." : "📧 Update Email"}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Account Role</label>
                  <input 
                    className="input" 
                    value={profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ""} 
                    readOnly 
                  />
                  <div className="muted" style={{ fontSize: ".85rem" }}>
                    Contact an administrator for role changes
                  </div>
                </div>
              </div>

              <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,.08)", margin: "20px 0" }} />

              <h4 className="sectionTitle" style={{ fontSize: "1rem", color: "var(--danger)" }}>
                ⚠️ Danger Zone
              </h4>
              <p className="muted" style={{ marginTop: 4 }}>
                Permanently delete your account and all associated data
              </p>
              <div className="btnRow">
                <button className="btn danger" onClick={() => setConfirmDeleteOpen(true)}>
                  🗑️ Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Uploaded Files Section */}
        <section className="card block" aria-labelledby="files-heading">
          <h3 id="files-heading" className="sectionTitle">📁 Your Uploaded Files</h3>
          <div className="muted" style={{ marginTop: 4 }}>
            Manage your uploaded teaching materials and resources
          </div>

          {loadingFiles ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Loading your files...
            </div>
          ) : files.length === 0 ? (
            <div className="muted" style={{ marginTop: 16, textAlign: 'center', padding: '2rem' }}>
              You haven't uploaded any files yet.
              <div style={{ marginTop: 12 }}>
                <Link to="/resources" className="btn">📤 Upload Your First File</Link>
              </div>
            </div>
          ) : (
            <div className="files">
              {files.map((file) => (
                <div key={file.id} className="file">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <span style={{ fontSize: "1.5rem" }}>📦</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        {file.title || file.name}
                        <small className="muted" style={{ marginLeft: 8 }}>
                          ({file.type})
                        </small>
                      </div>
                      {file.description && (
                        <div className="muted" style={{ fontSize: ".9rem", marginBottom: 4 }}>
                          {file.description}
                        </div>
                      )}
                      <div className="muted" style={{ fontSize: ".85rem" }}>
                        {file.level && <span style={{ marginRight: 12 }}>📊 {file.level}</span>}
                        {file.created_at && (
                          <span>🕒 {new Date(file.created_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="btnRow" style={{ marginTop: 0 }}>
                    <button
                      className="btn secondary"
                      onClick={() => deleteFile(file.id)}
                      disabled={deletingId === file.id}
                      aria-label={`Delete ${file.title || file.name}`}
                    >
                      {deletingId === file.id ? "⏳ Deleting..." : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Security Section */}
        <section className="card block" aria-labelledby="security-heading">
          <h3 id="security-heading" className="sectionTitle">🔒 Security</h3>
          <div className="muted" style={{ marginTop: 4 }}>
            Manage your account security and session
          </div>
          <div className="btnRow" style={{ marginTop: 16 }}>
            <button className="btn secondary" onClick={handleResetPassword}>
              🔑 Reset Password
            </button>
            <button className="btn secondary" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {confirmDeleteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm account deletion"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.7)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setConfirmDeleteOpen(false)}
        >
          <div
            className="card"
            style={{ 
              width: "min(500px, 100%)",
              background: "var(--surface)",
              border: "2px solid var(--danger)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="sectionTitle" style={{ color: "var(--danger)", marginBottom: 12 }}>
              ⚠️ Delete Your Account?
            </h3>
            <p className="muted" style={{ marginBottom: 20, lineHeight: 1.6 }}>
              This action cannot be undone. This will permanently delete your account and remove all of your data including:
            </p>
            <ul className="muted" style={{ marginBottom: 24, paddingLeft: 20, lineHeight: 1.6 }}>
              <li>Your profile information</li>
              <li>All uploaded files and resources</li>
              <li>Your progress and statistics</li>
              <li>Any reviews or comments you've made</li>
            </ul>
            <div className="btnRow">
              <button className="btn danger" onClick={deleteAccount}>
                🗑️ Yes, Delete My Account
              </button>
              <button className="btn secondary" onClick={() => setConfirmDeleteOpen(false)}>
                ↩️ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {error && (
        <div className="toast error" role="alert">
          ⚠️ {error}
        </div>
      )}
      {toast && (
        <div className="toast success" role="status" aria-live="polite">
          ✅ {toast}
        </div>
      )}
    </div>  
  );
}