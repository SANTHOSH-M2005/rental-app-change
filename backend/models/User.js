const db = require('../database/database');
const bcrypt = require('bcryptjs');

class User {
  static create(userData, callback) {
    const { name, email, password, phone } = userData;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run(
      `INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, phone],
      function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: this.lastID, name, email, phone });
        }
      }
    );
  }

  static findByEmail(email, callback) {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      callback(err, row);
    });
  }

  static findById(id, callback) {
    db.get(`SELECT id, name, email, phone, created_at FROM users WHERE id = ?`, [id], (err, row) => {
      callback(err, row);
    });
  }
}

module.exports = User;