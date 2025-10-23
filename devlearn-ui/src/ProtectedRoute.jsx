// src/ProtectedRoute.jsx - Enhanced with better loading states and error handling
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "./api";

export default function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    authenticated: false,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("🛡️ Checking authentication...");
        const result = await api.getMe();
        
        if (mounted) {
          if (result.ok) {
            console.log("✅ User authenticated");
            setAuthStatus({
              loading: false,
              authenticated: true,
              error: null
            });
          } else {
            console.log("❌ User not authenticated");
            setAuthStatus({
              loading: false,
              authenticated: false,
              error: result.error
            });
          }
        }
      } catch (error) {
        if (mounted) {
          console.error("🔒 Auth check failed:", error);
          setAuthStatus({
            loading: false,
            authenticated: false,
            error: error.message
          });
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Show loading spinner
  if (authStatus.loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--muted)',
            borderTop: '3px solid var(--brand)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Checking authentication...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authStatus.authenticated) {
    console.log("🔒 Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
}

// Optional: Public Route component for routes that should only be accessible when not authenticated
export function PublicRoute({ children }) {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    authenticated: false
  });

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const result = await api.getMe();
        if (mounted) {
          setAuthStatus({
            loading: false,
            authenticated: result.ok
          });
        }
      } catch (error) {
        if (mounted) {
          setAuthStatus({
            loading: false,
            authenticated: false
          });
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (authStatus.loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (authStatus.authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}