
// queries.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

console.log('=== TASK 2 QUERIES ===\n');

// Query A - All columns of every product
console.log('QUERY A: All products (all columns)');
console.log(db.prepare('SELECT * FROM products').all());
console.log('\n');

// Query B - Only name and price
console.log('QUERY B: Name and price only');
console.log(db.prepare('SELECT name, price FROM products').all());
console.log('\n');

// Query C - Product with id = 3
console.log('QUERY C: Product id = 3');
console.log(db.prepare('SELECT * FROM products WHERE id = ?').get(3));
console.log('\n');

// Query D - Products with name containing 'sheet' (case insensitive)
console.log('QUERY D: Products containing "sheet"');
console.log(db.prepare("SELECT * FROM products WHERE LOWER(name) LIKE ?").all('%sheet%'));
console.log('\n');

// Query E - Sorted by price highest first
console.log('QUERY E: Sorted by price DESC');
console.log(db.prepare('SELECT * FROM products ORDER BY price DESC').all());
console.log('\n');

// Query F - 2 most expensive products
console.log('QUERY F: Top 2 most expensive');
console.log(db.prepare('SELECT * FROM products ORDER BY price DESC LIMIT 2').all());
console.log('\n');

// Query G - Update Cement price to 38,000
console.log('QUERY G: Update Cement price to 38,000');
db.prepare('UPDATE products SET price = ? WHERE id = ?').run(38000, 1);
console.log('After update:');
console.log(db.prepare('SELECT * FROM products WHERE id = ?').get(1));

db.close();