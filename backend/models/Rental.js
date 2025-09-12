const db = require('../database/database');

class Rental {
  static create(rentalData, callback) {
    const { user_id, vehicle_id, start_date, end_date, total_cost } = rentalData;
    
    db.run(
      `INSERT INTO rentals (user_id, vehicle_id, start_date, end_date, total_cost) VALUES (?, ?, ?, ?, ?)`,
      [user_id, vehicle_id, start_date, end_date, total_cost],
      function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: this.lastID, ...rentalData });
        }
      }
    );
  }

  static findByUserId(userId, callback) {
    db.all(
      `SELECT r.*, v.type, v.brand, v.model 
       FROM rentals r 
       JOIN vehicles v ON r.vehicle_id = v.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [userId],
      (err, rows) => {
        callback(err, rows);
      }
    );
  }

  static updateStatus(id, status, callback) {
    db.run(
      `UPDATE rentals SET status = ? WHERE id = ?`,
      [status, id],
      function(err) {
        callback(err, this.changes);
      }
    );
  }
}

module.exports = Rental;