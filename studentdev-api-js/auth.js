// auth.js - Enhanced with better validation and security
import { getPool } from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireAuth } from "./authMiddleware.js";

const COOKIE_NAME = "auth";
const BCRYPT_ROUNDS = 12;
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || "7d";

// Input validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

export function registerAuthRoutes(app) {
  // POST /api/auth/register - Enhanced with validation
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, role = 'student' } = req.body || {};
      
      // Enhanced validation
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: "Name, email and password are required.",
          code: "MISSING_FIELDS"
        });
      }

      if (!validateName(name)) {
        return res.status(400).json({ 
          error: "Name must be between 2 and 100 characters.",
          code: "INVALID_NAME"
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ 
          error: "Please provide a valid email address.",
          code: "INVALID_EMAIL"
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ 
          error: "Password must be at least 8 characters long.",
          code: "INVALID_PASSWORD"
        });
      }

      if (!['student', 'lecturer', 'admin'].includes(role)) {
        return res.status(400).json({ 
          error: "Invalid role specified.",
          code: "INVALID_ROLE"
        });
      }

      const pool = await getPool();

      // Check if email already exists
      const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email.toLowerCase().trim()]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({ 
          error: "Email already registered.",
          code: "EMAIL_EXISTS"
        });
      }

      // Hash password
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

      // Create user
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash, role, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [name.trim(), email.toLowerCase().trim(), hash, role]
      );

      const id = result.insertId;

      // Generate JWT token
      const token = jwt.sign(
        { 
          sub: String(id), 
          email: email.toLowerCase().trim(), 
          role: role,
          name: name.trim()
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: TOKEN_EXPIRY }
      );

      // Set HTTP-only cookie
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/"
      });

      // Return user data (excluding sensitive information)
      return res.status(201).json({ 
        id, 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        role,
        message: "Registration successful"
      });

    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ 
        error: "Server error during registration",
        code: "REGISTRATION_FAILED"
      });
    }
  });

  // POST /api/auth/login - Enhanced with security
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: "Email and password are required.",
          code: "MISSING_CREDENTIALS"
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ 
          error: "Please provide a valid email address.",
          code: "INVALID_EMAIL"
        });
      }

      const pool = await getPool();

      // Get user with case-insensitive email
      const [users] = await pool.execute(
        `SELECT id, name, email, password_hash, role, avatar_url 
         FROM users WHERE LOWER(email) = LOWER(?)`,
        [email.trim()]
      );

      const user = users[0];
      
      // Generic error to prevent user enumeration
      if (!user) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        // Log failed login attempt
        console.warn(`Failed login attempt for email: ${email}`);
        return res.status(401).json({ 
          error: "Invalid credentials",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          sub: String(user.id), 
          email: user.email, 
          role: user.role,
          name: user.name
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: TOKEN_EXPIRY }
      );

      // Set HTTP-only cookie
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/"
      });

      // Return user data
      return res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        avatarUrl: user.avatar_url,
        message: "Login successful"
      });

    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ 
        error: "Server error during login",
        code: "LOGIN_FAILED"
      });
    }
  });

  // GET /api/me - Get current user
  app.get("/api/me", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      
      const [users] = await pool.execute(
        `SELECT u.id, u.name, u.email, u.role, u.avatar_url,
                p.theme, p.display_name 
         FROM users u 
         LEFT JOIN user_profiles p ON p.user_id = u.id 
         WHERE u.id = ?`,
        [req.user.id]
      );

      const user = users[0];
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        id: user.id,
        name: user.display_name || user.name,
        email: user.email,
        role: user.role,
        theme: user.theme || "dark",
        avatarUrl: user.avatar_url,
        permissions: req.user.permissions
      });
    } catch (err) {
      console.error("Get user error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", requireAuth, (req, res) => {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    
    return res.json({ 
      ok: true, 
      message: "Logged out successfully" 
    });
  });

  // POST /api/auth/refresh - Refresh token
  app.post("/api/auth/refresh", requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      
      const [users] = await pool.execute(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [req.user.id]
      );

      const user = users[0];
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate new token
      const token = jwt.sign(
        { 
          sub: String(user.id), 
          email: user.email, 
          role: user.role,
          name: user.name
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: TOKEN_EXPIRY }
      );

      // Set new cookie
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
      });

      return res.json({ 
        ok: true, 
        message: "Token refreshed" 
      });
    } catch (err) {
      console.error("Token refresh error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  });
}