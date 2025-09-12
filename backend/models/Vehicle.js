// backend/models/Vehicle.js
const db = require("../database/database");

class Vehicle {
  static findAll(filters, callback) {
    let query = `SELECT * FROM vehicles WHERE 1=1`;
    let params = [];

    if (filters.type) {
      query += ` AND type = ?`;
      params.push(filters.type);
    }

    if (filters.brand) {
      query += ` AND brand LIKE ?`;
      params.push(`%${filters.brand}%`);
    }

    if (filters.minPrice) {
      query += ` AND price_per_day >= ?`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ` AND price_per_day <= ?`;
      params.push(filters.maxPrice);
    }

    if (filters.available !== undefined) {
      query += ` AND available = ?`;
      params.push(filters.available);
    }

    db.all(query, params, (err, rows) => {
      callback(err, rows);
    });
  }

  static findById(id, callback) {
    db.get(`SELECT * FROM vehicles WHERE id = ?`, [id], (err, row) => {
      callback(err, row);
    });
  }

  static updateAvailability(id, available, callback) {
    db.run(
      `UPDATE vehicles SET available = ? WHERE id = ?`,
      [available, id],
      function (err) {
        callback(err, this.changes);
      }
    );
  }
}

module.exports = Vehicle;
