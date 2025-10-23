import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Profile.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import PathwayPage from "./pages/PathwayPage.jsx";
import LevelPage from "./pages/LevelPage.jsx";
import { api, API_BASE } from "./api";

/* =========================
   Styles
   ========================= */
const pageStyles = {
  wrapper: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 30,
    color: "#6ee7ff",
    textAlign: "center",
    animation: "fadeFloat 4s ease-in-out infinite",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    padding: 32,
    borderRadius: 18,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 2,
  },
  title: { fontSize: 28, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { fontSize: 14, color: "#94a3b8", margin: "0 0 20px" },
  label: { fontSize: 12, color: "#a8b3c7" },
  input: {
    width: "100%",
    height: 44,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #334155",
    background: "#0b1220",
    color: "#e5e7eb",
    outline: "none",
  },
  button: {
    width: "100%",
    height: 44,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #2b3b55",
    background: "linear-gradient(90deg,#3b82f6,#2563eb)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
  ghostBtn: {
    width: "100%",
    height: 40,
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid #334155",
    background: "transparent",
    color: "#cbd5e1",
    cursor: "pointer",
  },
  nav: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
  },
  hint: { fontSize: 12, color: "#94a3b8", marginTop: 8, textAlign: "center" },
};

const formStyles = { display: "grid", gap: 14 };
const fieldStyles = { display: "grid", gap: 6 };

const inputFocus = {
  outline: "2px solid #38bdf8",
  outlineOffset: 1,
  borderColor: "#38bdf8",
};

const roleWrap = { display: "grid", gap: 8 };
const roleRow = { display: "flex", gap: 8, flexWrap: "wrap" };
const rolePill = (active) => ({
  padding: "10px 14px",
  borderRadius: 12,
  border: active ? "1px solid #38bdf8" : "1px solid #334155",
  background: active ? "rgba(56,189,248,0.12)" : "transparent",
  color: active ? "#e6f9ff" : "#cbd5e1",
  cursor: "pointer",
  fontWeight: 700,
});

const leftGlowStyle = {
  position: "absolute",
  top: "50%",
  left: "-200px",
  transform: "translateY(-50%)",
  width: "600px",
  height: "600px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6ee7ff, #9b8cff)",
  filter: "blur(160px)",
  opacity: 0.35,
  pointerEvents: "none",
  zIndex: 1,
};
const rightGlowStyle = {
  position: "absolute",
  top: "50%",
  right: "-200px",
  transform: "translateY(-50%)",
  width: "600px",
  height: "600px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #40ffb3, #6ee7ff)",
  filter: "blur(160px)",
  opacity: 0.35,
  pointerEvents: "none",
  zIndex: 1,
};

/* =========================
   Layout Frame
   ========================= */
function Frame({ children, title, subtitle }) {
  const location = useLocation();
  return (
    <div style={pageStyles.wrapper}>
      <div style={leftGlowStyle} />
      <div style={rightGlowStyle} />

      <h2 style={pageStyles.header}>StudentDev Hub Portal</h2>

      <div style={pageStyles.card}>
        <h1 style={pageStyles.title}>{title}</h1>
        {subtitle && <p style={pageStyles.subtitle}>{subtitle}</p>}
        {children}
        <div style={pageStyles.nav}>
          <SmallLink to="/login" active={location.pathname === "/login"}>
            Login
          </SmallLink>
          <SmallLink to="/register" active={location.pathname === "/register"}>
            Register
          </SmallLink>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeFloat {
            0% { opacity: 0; transform: translateY(-20px); }
            20% { opacity: 1; transform: translateY(0); }
            50% { transform: translateY(-6px); }
            80% { transform: translateY(0); }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

function SmallLink({ to, active, children }) {
  return (
    <Link
      to={to}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #334155",
        textDecoration: "none",
        color: active ? "#0ea5e9" : "#cbd5e1",
        background: active ? "rgba(14,165,233,0.08)" : "transparent",
        fontSize: 13,
      }}
    >
      {children}
    </Link>
  );
}

/* =========================
   Pages
   ========================= */
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    // quick client checks
    if (!email || !password) {
      setErr("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      
      const result = await api.login({ email, password });

      if (!result.ok) {
        // Use the error from the API response
        const msg = result.error || "Login failed";
        setErr(msg);
        return;
      }

      // success: cookie set by server; go to dashboard
      navigate("/dashboard");
    } catch {
      setErr("Network error. Is the API running on http://localhost:3001?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Frame title="Welcome back" subtitle="Login to your account">
      <form onSubmit={handleSubmit} style={formStyles} noValidate>
        <div style={fieldStyles}>
          <label style={pageStyles.label}>Email</label>
          <input
            style={pageStyles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, pageStyles.input)}
            required
          />
        </div>

        <div style={fieldStyles}>
          <label style={pageStyles.label}>Password</label>
          <input
            style={pageStyles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, pageStyles.input)}
            required
          />
        </div>

        {err && (
          <div style={{ color: "#f87171", fontSize: 13, marginTop: -4 }}>
            {err}
          </div>
        )}

        <button type="submit" style={{ ...pageStyles.button, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <p style={pageStyles.hint}>No account? Use the Register page.</p>
      </form>
    </Frame>
  );
}

function RegistrationPage() {
  const [name, setName] = useState("");
  const [email2, setEmail2] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("student");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function basicPasswordOk(pw) {
    return pw.length >= 8; // tweak to your policy
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!name || !email2 || !password) {
      setErr("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    if (!basicPasswordOk(password)) {
      setErr("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email: email2, password, role }),
      });

      if (!res.ok) {
        let msg = "Registration failed";
        try {
          const body = await res.json();
          if (body?.error) msg = body.error;
        } catch {}
        if (res.status === 409) msg = "Email already registered.";
        setErr(msg);
        return;
      }

      // success: cookie set; go to dashboard
      navigate("/dashboard");
    } catch {
      setErr("Network error. Is the API running on http://localhost:3001?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Frame title="Create your account" subtitle="Basic registration">
      <form onSubmit={handleSubmit} style={formStyles} noValidate>
        <div style={roleWrap}>
          <span style={pageStyles.label}>Register as</span>
          <div style={roleRow} role="radiogroup" aria-label="Register as">
            <button
              type="button"
              role="radio"
              aria-checked={role === "student"}
              onClick={() => setRole("student")}
              style={rolePill(role === "student")}
            >
              👩‍🎓 Student
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={role === "lecturer"}
              onClick={() => setRole("lecturer")}
              style={rolePill(role === "lecturer")}
            >
              👨‍🏫 Lecturer
            </button>
          </div>
        </div>

        <div style={fieldStyles}>
          <label style={pageStyles.label}>Full name</label>
          <input
            style={pageStyles.input}
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, pageStyles.input)}
            required
          />
        </div>

        <div style={fieldStyles}>
          <label style={pageStyles.label}>Email</label>
          <input
            style={pageStyles.input}
            type="email"
            placeholder="jane@company.com"
            value={email2}
            onChange={(e) => setEmail2(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, pageStyles.input)}
            required
          />
        </div>

        <div style={fieldStyles}>
          <label style={pageStyles.label}>Password</label>
          <input
            style={pageStyles.input}
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, pageStyles.input)}
            required
          />
        </div>

        <div style={fieldStyles}>
          <label style={pageStyles.label}>Confirm password</label>
          <input
            style={pageStyles.input}
            type="password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, pageStyles.input)}
            required
          />
        </div>

        {err && (
          <div style={{ color: "#f87171", fontSize: 13, marginTop: -4 }}>
            {err}
          </div>
        )}

        <button type="submit" style={{ ...pageStyles.button, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>

        <div style={{ height: 10 }} />
        <Link
          to="/login"
          style={{ ...pageStyles.ghostBtn, display: "inline-block", textAlign: "center" }}
        >
          Back to Login
        </Link>
      </form>
    </Frame>
  );
}


/* =========================
   App + 404
   ========================= */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resources" element={<ResourcesPage />} /> 
        <Route path="/community" element={<CommunityPage />} /> 
        <Route path="/PathwayPage" element={<PathwayPage/>} /> 
        <Route path="/level/:pathwaySlug/:levelSlug" element={<LevelPage />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function NotFound() {
  return (
    <Frame title="404" subtitle="Page not found">
      <Link
        to="/login"
        style={{ ...pageStyles.ghostBtn, display: "inline-block", textAlign: "center" }}
      >
        Go to Login
      </Link>
    </Frame>
  );
}
