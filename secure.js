
// secure.js - Parameterised queries prevent SQL injection
const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// SECURE: Using parameterised query with placeholder ?
function searchProductSafe(name) {
    // ? is a placeholder - SQLite escapes user input automatically
    const query = `SELECT * FROM products WHERE name LIKE '%' || ? || '%'`;
    console.log('\n[SECURE SEARCH] Query:', query);
    console.log('[SECURE SEARCH] Parameter:', name);
    
    const stmt = db.prepare(query);
    const rows = stmt.all(name);
    console.log('[SECURE SEARCH] Result:', rows);
    return rows;
}

// SECURE: Using parameterised query with placeholder ?
function loginSafe(username, password) {
    // ? placeholders prevent any injection
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    console.log('\n[SECURE LOGIN] Query:', query);
    console.log('[SECURE LOGIN] Parameters:', username, password);
    
    const stmt = db.prepare(query);
    const row = stmt.get(username, password);
    console.log('[SECURE LOGIN] Result:', row);
    return row;
}

console.log('\n========== TESTING SECURE FUNCTIONS ==========\n');

// Test 1: Attack payload that worked before - now returns nothing
console.log('\n--- TEST 1: Previous attack payloads now fail ---');
console.log('Test 1a (search attack):', searchProductSafe("' OR 1=1--"));
console.log('\nTest 1b (UNION attack):', searchProductSafe("' UNION SELECT id,username,password,role FROM users--"));

// Test 2: Login attacks that worked before - now fail
console.log('\n--- TEST 2: Login attacks now fail ---');
console.log('Test 2a (admin bypass):', loginSafe("admin'--", 'anything'));
console.log('Test 2b (always true):', loginSafe("' OR '1'='1", "' OR '1'='1"));

// Test 3: Legitimate inputs still work
console.log('\n--- TEST 3: Legitimate inputs still work ---');
console.log('Test 3a (search cement):', searchProductSafe('cement'));
console.log('Test 3b (login admin):', loginSafe('admin', 'admin123'));
console.log('Test 3c (login fatuma):', loginSafe('fatuma', 'pass456'));

db.close();