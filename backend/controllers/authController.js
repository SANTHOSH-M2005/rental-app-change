const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // install with: npm install nodemailer

const authController = {
  // ---------------------------
  // REGISTER
  // ---------------------------
  register: (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    User.findByEmail(email, (err, existingUser) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      // Hash password before saving
      const hashedPassword = bcrypt.hashSync(password, 10);

      User.create({ name, email, password: hashedPassword, phone }, (err, newUser) => {
        if (err) return res.status(500).json({ message: 'Error creating user' });

        const token = jwt.sign(
          { userId: newUser.id },
          process.env.JWT_SECRET || 'your_jwt_secret',
          { expiresIn: '7d' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: newUser
        });
      });
    });
  },

  // ---------------------------
  // LOGIN
  // ---------------------------
  login: (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    User.findByEmail(email, (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    });
  },

  // ---------------------------
  // FORGOT PASSWORD
  // ---------------------------
  forgotPassword: (req, res) => {
    const { email } = req.body;

    User.findByEmail(email, (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (!user) {
        // Don't reveal whether email exists
        return res.json({ message: 'If the email exists, reset instructions will be sent' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      // Save resetToken + expiry in DB (pseudo-code)
      // User.updateResetToken(user.id, resetToken, resetTokenExpiry);

      // Setup mailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the link to reset your password: ${resetLink}`
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending reset email' });
        }
        res.json({ message: 'Password reset instructions sent to your email' });
      });
    });
  },

  // ---------------------------
  // RESET PASSWORD
  // ---------------------------
  resetPassword: (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Pseudo: find user by token & expiry
    // User.findByResetToken(token, (err, user) => { ... })

    // Example only – in real setup, you'd check DB for token + expiry
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    // User.updatePassword(user.id, hashedPassword);

    res.json({ message: 'Password reset successfully' });
  }
};

module.exports = authController;
