const db = require('../database/database');

class Favorite {
  static addFavorite(userId, favoriteData, callback) {
    const { vehicle_id, sale_id, type } = favoriteData;
    
    db.run(
      `INSERT INTO favorites (user_id, vehicle_id, sale_id, type) VALUES (?, ?, ?, ?)`,
      [userId, vehicle_id, sale_id, type],
      function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: this.lastID, user_id: userId, ...favoriteData });
        }
      }
    );
  }

  static removeFavorite(userId, favoriteId, callback) {
    db.run(
      `DELETE FROM favorites WHERE id = ? AND user_id = ?`,
      [favoriteId, userId],
      function(err) {
        callback(err, this.changes);
      }
    );
  }

  static getUserFavorites(userId, callback) {
    db.all(
      `SELECT f.*, 
              v.brand as vehicle_brand, v.model as vehicle_model, v.image_url as vehicle_image,
              vs.brand as sale_brand, vs.model as sale_model, vs.image_url as sale_image, vs.price as sale_price
       FROM favorites f
       LEFT JOIN vehicles v ON f.vehicle_id = v.id AND f.type = 'rental'
       LEFT JOIN vehicle_sales vs ON f.sale_id = vs.id AND f.type = 'sale'
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId],
      (err, rows) => {
        callback(err, rows);
      }
    );
  }

  static checkFavorite(userId, itemId, type, callback) {
    const field = type === 'rental' ? 'vehicle_id' : 'sale_id';
    db.get(
      `SELECT id FROM favorites WHERE user_id = ? AND ${field} = ? AND type = ?`,
      [userId, itemId, type],
      (err, row) => {
        callback(err, row);
      }
    );
  }
}

module.exports = Favorite;