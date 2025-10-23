import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool, sql } from '../db.js';

const router = Router();

function setAuthCookie(res, token) {
  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Missing fields' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password too short (min 6)' });

    const pool = await getPool();

    // Unique email check
    const existing = await pool.request()
      .input('email', sql.NVarChar(190), email)
      .query('SELECT Id FROM Users WHERE Email = @email');
    if (existing.recordset.length)
      return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const insert = await pool.request()
      .input('name', sql.NVarChar(120), name)
      .input('email', sql.NVarChar(190), email)
      .input('passwordHash', sql.NVarChar(255), passwordHash)
      .input('role', sql.NVarChar(50), role)
      .query(`
        INSERT INTO Users (Name, Email, PasswordHash, Role)
        OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Email, INSERTED.Role
        VALUES (@name, @email, @passwordHash, @role);
      `);

    const user = insert.recordset[0];
    const token = jwt.sign({ uid: user.Id, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);

    res.status(201).json({ id: user.Id, name: user.Name, email: user.Email, role: user.Role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Missing email or password' });

    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar(190), email)
      .query(`
        SELECT TOP 1 Id, Name, Email, PasswordHash, Role
        FROM Users WHERE Email = @email
      `);

    if (!result.recordset.length)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.recordset[0];
    const ok = await bcrypt.compare(password, user.PasswordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ uid: user.Id, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);

    res.json({ id: user.Id, name: user.Name, email: user.Email, role: user.Role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const pool = await getPool();
    const row = await pool.request()
      .input('id', sql.Int, payload.uid)
      .query('SELECT Id, Name, Email, Role FROM Users WHERE Id = @id');

    if (!row.recordset.length) return res.status(401).json({ error: 'Unknown user' });

    res.json(row.recordset[0]);
  } catch {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
