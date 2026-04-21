
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

db.close();