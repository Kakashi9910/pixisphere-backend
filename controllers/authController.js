import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!email || !role) return res.status(400).json({ error: 'email & role required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already used' });

    const user = new User({ name, email, role, phone, password });
    await user.save();
    const token = signToken(user);
    res.json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

export const sendOtp = async (req, res) => {
  // Mock OTP sending
  res.json({ ok: true, msg: 'OTP sent (mock)' });
};
