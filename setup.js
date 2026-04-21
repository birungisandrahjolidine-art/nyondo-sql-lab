
//Birungi sandrah Jolidine

// setup.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// Create products table
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL
    )
`);

// Insert products using transaction
const insert = db.prepare('INSERT INTO products (name, description, price) VALUES (?, ?, ?)');
const insertAll = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
});

insertAll([
    ['Cement (bag)', 'Portland cement 50kg bag', 35000],
    ['Iron Sheet 3m', 'Gauge 30 roofing sheet 3m long', 110000],
    ['Paint 5L', 'Exterior wall paint white 5L', 60000],
    ['Nails 1kg', 'Common wire nails 1kg pack', 12000],
    ['Timber 2x4', 'Pine timber plank 2x4 per metre', 25000]
]);

// Verify insertion
console.log('=== All Products ===');
const rows = db.prepare('SELECT * FROM products').all();
console.table(rows);

console.log(`\nTotal products: ${rows.length}`);

// Add users table (add this BEFORE db.close() in setup.js)
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'attendant'
    )
`);

// Insert users
const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)');
const users = [
    ['admin', 'admin123', 'admin'],
    ['fatuma', 'pass456', 'attendant'],
    ['wasswa', 'pass789', 'manager']
];

for (const user of users) {
    insertUser.run(user[0], user[1], user[2]);
}

// Verify users
console.log('\n=== Users Table ===');
console.table(db.prepare('SELECT * FROM users').all());

db.close();