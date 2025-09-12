const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  register: (req, res) => {
    const { name, email, password, phone } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }
    
    User.findByEmail(email, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      
      User.create({ name, email, password, phone }, (err, newUser) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user' });
        }
        
        // Generate JWT token
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
  
  login: (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    User.findByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
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
  }
};

module.exports = authController;