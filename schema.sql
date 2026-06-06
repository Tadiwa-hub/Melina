CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT,
  price REAL NOT NULL,
  description TEXT,
  capacity INTEGER,
  address TEXT,
  is_full_width BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  guests INTEGER,
  stay_type TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS blocked_dates (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  date TEXT NOT NULL,
  reason TEXT,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Seed data for properties
INSERT INTO properties (id, name, label, price, description, capacity, address, is_full_width) 
VALUES 
('aviemore-apartment', 'Aviemore Apartment', 'SELF CATERING', 175, 'A spacious self-catering 3 bedroom apartment with all the comforts of home for families and groups.', 6, NULL, 1),
('clairewood-2bed', 'Clairewood 2-Bed', 'SELF CATERING', 80, 'A comfortable self-catering 2 bedroom apartment. Located at 14 Ceres Road, Avondale, Flat 6.', 4, '14 Ceres Road, Avondale, Flat 6', 0),
('peterhouse-apartments', 'Peterhouse Apartments', 'SELF CATERING', 120, 'A well-appointed self-catering 3 bedroom apartment perfect for extended stays and family visits.', 6, NULL, 0);
