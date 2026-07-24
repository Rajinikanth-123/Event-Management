const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/mailer');
const { buildPasswordResetEmail } = require('../utils/emailTemplates');

const normalizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  phone: user.phone,
  createdAt: user.createdAt
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: ['user', 'organizer', 'admin'].includes(role) ? role : 'user'
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: normalizeUser(user)
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  res.json({ success: true, message: 'Login successful', token, user: normalizeUser(user) });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout successful' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html: buildPasswordResetEmail({
      appName: process.env.APP_NAME || 'Event Management System',
      resetUrl,
      userName: user.name
    })
  });

  res.json({ success: true, message: 'Password reset email sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Token, password, and confirm password are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Reset token is invalid or expired' });
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = '';
  user.resetPasswordExpire = undefined;
  await user.save();

  const jwtToken = generateToken(user._id);
  res.json({ success: true, message: 'Password reset successful', token: jwtToken, user: normalizeUser(user) });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: normalizeUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email.toLowerCase();
  if (phone !== undefined) user.phone = phone;

  if (newPassword || confirmPassword) {
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required to set a new password' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
  }

  if (req.file) {
    user.profileImage = `/uploads/${req.file.filename}`;
  }

  await user.save();
  res.json({ success: true, message: 'Profile updated successfully', user: normalizeUser(user) });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};