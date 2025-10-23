// authMiddleware.js - Enhanced with role-based access control
import jwt from "jsonwebtoken";

const COOKIE_NAME = "auth";

// Enhanced requireAuth with role checking
export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || 
                req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      error: "Authentication required",
      code: "NO_TOKEN"
    });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      id: Number(payload.sub), 
      email: payload.email, 
      role: payload.role,
      permissions: getPermissions(payload.role)
    };
    
    console.log(`🔐 Authenticated user: ${req.user.email} (${req.user.role})`);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token expired",
        code: "TOKEN_EXPIRED"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Invalid token",
        code: "INVALID_TOKEN"
      });
    }
    
    return res.status(401).json({ 
      error: "Authentication failed",
      code: "AUTH_FAILED"
    });
  }
}

// Role-based access control
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`🚫 Access denied for ${req.user.role} to ${req.method} ${req.path}`);
      return res.status(403).json({ 
        error: "Insufficient permissions",
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
}

// Admin-only middleware
export function requireAdmin(req, res, next) {
  return requireRole(['admin'])(req, res, next);
}

// Lecturer or Admin middleware
export function requireLecturer(req, res, next) {
  return requireRole(['lecturer', 'admin'])(req, res, next);
}

// Student or above middleware
export function requireStudent(req, res, next) {
  return requireRole(['student', 'lecturer', 'admin'])(req, res, next);
}

// Helper function to get permissions based on role
function getPermissions(role) {
  const permissions = {
    student: ['read:resources', 'write:reviews', 'save:resources'],
    lecturer: ['read:resources', 'write:reviews', 'save:resources', 'create:resources', 'manage:modules'],
    admin: ['read:resources', 'write:reviews', 'save:resources', 'create:resources', 'manage:modules', 'manage:users', 'system:config']
  };
  
  return permissions[role] || permissions.student;
}

// Optional auth - sets user if available but doesn't require it
export function optionalAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || 
                req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { 
        id: Number(payload.sub), 
        email: payload.email, 
        role: payload.role,
        permissions: getPermissions(payload.role)
      };
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed, continuing unauthenticated');
    }
  }
  
  next();
}