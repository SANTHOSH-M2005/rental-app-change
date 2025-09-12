const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'rentals.db');
const db = new sqlite3.Database(dbPath);

const imageUpdates = [
  {
    brand: 'Trek',
    model: 'FX 2',
    image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400'
  },
  {
    brand: 'Giant',
    model: 'Escape 3', 
    image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400'
  },
  {
    brand: 'Toyota',
    model: 'Corolla',
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'
  },
  {
    brand: 'Honda',
    model: 'CR-V',
    image_url: 'https://images.unsplash.com/photo-1603712610494-93e15447474c?w=400'
  }
];

db.serialize(() => {
  imageUpdates.forEach(vehicle => {
    db.run(
      `UPDATE vehicles SET image_url = ? WHERE brand = ? AND model = ?`,
      [vehicle.image_url, vehicle.brand, vehicle.model],
      function(err) {
        if (err) {
          console.error(`Error updating ${vehicle.brand} ${vehicle.model}:`, err);
        } else {
          console.log(`Updated ${vehicle.brand} ${vehicle.model}: ${this.changes} rows affected`);
        }
      }
    );
  });
});

db.close();