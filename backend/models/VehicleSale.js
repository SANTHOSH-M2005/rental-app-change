const db = require('../database/database');

class VehicleSale {
  static create(saleData, callback) {
    const { user_id, type, brand, model, year, price, condition, mileage, description, image_url, contact_email, contact_phone, location } = saleData;
    
    db.run(
      `INSERT INTO vehicle_sales (user_id, type, brand, model, year, price, condition, mileage, description, image_url, contact_email, contact_phone, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, type, brand, model, year, price, condition, mileage, description, image_url, contact_email, contact_phone, location],
      function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: this.lastID, ...saleData });
        }
      }
    );
  }

  static findAll(filters, callback) {
    let query = `SELECT vs.*, u.name as seller_name FROM vehicle_sales vs JOIN users u ON vs.user_id = u.id WHERE vs.status = 'available'`;
    let params = [];
    
    if (filters.type) {
      query += ` AND vs.type = ?`;
      params.push(filters.type);
    }
    
    if (filters.brand) {
      query += ` AND vs.brand LIKE ?`;
      params.push(`%${filters.brand}%`);
    }
    
    if (filters.minPrice) {
      query += ` AND vs.price >= ?`;
      params.push(filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query += ` AND vs.price <= ?`;
      params.push(filters.maxPrice);
    }
    
    if (filters.condition) {
      query += ` AND vs.condition = ?`;
      params.push(filters.condition);
    }
    
    query += ` ORDER BY vs.created_at DESC`;
    
    db.all(query, params, (err, rows) => {
      callback(err, rows);
    });
  }

  static findById(id, callback) {
    db.get(
      `SELECT vs.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone 
       FROM vehicle_sales vs JOIN users u ON vs.user_id = u.id WHERE vs.id = ?`,
      [id],
      (err, row) => {
        callback(err, row);
      }
    );
  }

  static findByUserId(userId, callback) {
    db.all(
      `SELECT * FROM vehicle_sales WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
      (err, rows) => {
        callback(err, rows);
      }
    );
  }

  static updateStatus(id, status, callback) {
    db.run(
      `UPDATE vehicle_sales SET status = ? WHERE id = ?`,
      [status, id],
      function(err) {
        callback(err, this.changes);
      }
    );
  }
}

module.exports = VehicleSale;