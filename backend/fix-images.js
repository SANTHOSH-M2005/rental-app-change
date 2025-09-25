const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'rentals.db');
const db = new sqlite3.Database(dbPath);

// UPDATED: Only bike URLs changed to real Indian motorcycles
const imageUpdates = [
  // BIKE UPDATES - Real Indian Motorcycles
  {
    brand: 'Trek',
    model: 'FX 2',
    image_url: 'https://img.autocarindia.com/Features/TVS%20Ronin.jpg?w=700&c=0'
  },
  {
    brand: 'Giant',
    model: 'Escape 3', 
    image_url: 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/205660/apache-160-right-side-view.jpeg?isig=0&q=80&wm=3'
  },
  // CAR UPDATES - Keep existing car images (they work fine)
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

  // Add additional Indian bikes if they don't exist
  const additionalBikes = [
    {
      type: 'bike',
      brand: 'TVS', 
      model: 'Raider 125',
      year: 2023,
      price_per_hour: 10.00,
      price_per_day: 80.00,
      available: 1,
      image_url: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/103183/raider-125-right-side-view-20.png?isig=0&q=80',
      description: 'Stylish commuter motorcycle',
      features: '125cc engine, sharp styling, excellent mileage'
    },
    {
      type: 'bike',
      brand: 'Yamaha',
      model: 'R15 V4', 
      year: 2023,
      price_per_hour: 18.00,
      price_per_day: 150.00,
      available: 1,
      image_url: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/209893/r15-right-side-view.jpeg?isig=0&q=80',
      description: 'Premium sports bike',
      features: '155cc liquid-cooled engine, racing heritage, VVA technology'
    },
    {
      type: 'bike',
      brand: 'Generic',
      model: 'Sport Bike',
      year: 2022, 
      price_per_hour: 14.00,
      price_per_day: 110.00,
      available: 1,
      image_url: 'https://i.cdn.newsbytesapp.com/images/l65520240516142907.jpeg',
      description: 'Reliable sport motorcycle',
      features: 'Fuel efficient, comfortable seating, digital display'
    }
  ];

  // Insert additional bikes (will be ignored if they already exist due to UNIQUE constraints)
  additionalBikes.forEach(bike => {
    db.run(
      `INSERT OR IGNORE INTO vehicles (type, brand, model, year, price_per_hour, price_per_day, available, image_url, description, features) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bike.type, bike.brand, bike.model, bike.year, bike.price_per_hour, bike.price_per_day, bike.available, bike.image_url, bike.description, bike.features],
      function(err) {
        if (err) {
          console.error(`Error inserting ${bike.brand} ${bike.model}:`, err);
        } else if (this.changes > 0) {
          console.log(`Added new bike: ${bike.brand} ${bike.model}`);
        }
      }
    );
  });
});

db.close();