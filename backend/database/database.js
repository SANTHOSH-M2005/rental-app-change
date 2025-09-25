const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'rentals.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Vehicles table
  db.run(`CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('bike', 'car')),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    description TEXT,
    features TEXT
  )`);

  // Rentals table
  db.run(`CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
  )`);

  // Insert sample data - UPDATED with real Indian bike images
  db.run(`INSERT OR IGNORE INTO vehicles (type, brand, model, year, price_per_hour, price_per_day, available, image_url, description, features) VALUES
    ('bike', 'TVS', 'Ronin', 2023, 15.00, 120.00, 1, 'https://img.autocarindia.com/Features/TVS%20Ronin.jpg?w=700&c=0', 'Modern adventure touring motorcycle', '225cc engine, LED headlamps, dual-channel ABS'),
    ('bike', 'TVS', 'Apache 160', 2023, 12.00, 100.00, 1, 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/205660/apache-160-right-side-view.jpeg?isig=0&q=80&wm=3', 'Sporty performance motorcycle', '160cc engine, racing DNA, digital console'),
    ('bike', 'TVS', 'Raider 125', 2022, 10.00, 80.00, 1, 'https://imgd.aeplcdn.com/370x208/n/cw/ec/103183/raider-125-right-side-view-20.png?isig=0&q=80', 'Stylish commuter bike', '125cc engine, sharp styling, excellent mileage'),
    ('bike', 'Yamaha', 'R15 V4', 2023, 18.00, 150.00, 1, 'https://imgd.aeplcdn.com/370x208/n/cw/ec/209893/r15-right-side-view.jpeg?isig=0&q=80', 'Premium sports bike', '155cc liquid-cooled engine, racing heritage, VVA technology'),
    ('bike', 'Generic', 'Sport Bike', 2022, 14.00, 110.00, 1, 'https://i.cdn.newsbytesapp.com/images/l65520240516142907.jpeg', 'Reliable sport motorcycle', 'Fuel efficient, comfortable seating, digital display'),
    ('car', 'Toyota', 'Corolla', 2022, 15.00, 85.00, 1, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400', 'Economical and reliable sedan', 'Automatic transmission, 4 doors, air conditioning'),
    ('car', 'Honda', 'CR-V', 2023, 20.00, 110.00, 1, 'https://images.unsplash.com/photo-1603712610494-93e15447474c?w=400', 'Spacious and comfortable SUV', 'Automatic transmission, 5 seats, GPS navigation')
  `);
});

// Add new tables for vehicle sales
db.serialize(() => {
  // Vehicle listings for sale
  db.run(`CREATE TABLE IF NOT EXISTS vehicle_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('bike', 'car')),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    condition TEXT CHECK(condition IN ('excellent', 'good', 'fair')),
    mileage INTEGER,
    description TEXT,
    image_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    location TEXT,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'sold', 'pending')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Favorites table
  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER,
    sale_id INTEGER,
    type TEXT NOT NULL CHECK(type IN ('rental', 'sale')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    FOREIGN KEY (sale_id) REFERENCES vehicle_sales (id)
  )`);

  // Reviews table
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    type TEXT NOT NULL CHECK(type IN ('rental', 'sale')),
    related_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

module.exports = db;