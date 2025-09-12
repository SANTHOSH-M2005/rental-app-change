const User = require('../models/User');

const userController = {
  getUserById: (req, res) => {
    const userId = req.params.id;
    
    User.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    });
  }
};

module.exports = userController;