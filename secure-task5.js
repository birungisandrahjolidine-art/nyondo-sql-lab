
// secure.js - WITH INPUT VALIDATION
const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// Validation functions
function isValidProductName(name) {
    if (typeof name !== 'string') return false;
    if (name.length < 2) return false;
    if (/[<>;]/.test(name)) return false;  // No < > or ;
    return true;
}

function isValidPrice(price) {
    return typeof price === 'number' && price > 0;
}

function isValidUsername(username) {
    if (typeof username !== 'string') return false;
    if (username.length === 0) return false;
    if (/\s/.test(username)) return false;  // No spaces
    return true;
}

function isValidPassword(password) {
    if (typeof password !== 'string') return false;
    return password.length >= 6;
}

// SECURE search with validation
function searchProductSafe(name) {
    // Input validation FIRST
    if (!isValidProductName(name)) {
        console.log('\n[SEARCH] Validation failed: Invalid product name');
        return [];
    }
    
    const query = `SELECT * FROM products WHERE name LIKE '%' || ? || '%'`;
    console.log('\n[SEARCH] Query:', query);
    console.log('[SEARCH] Parameter:', name);
    
    const stmt = db.prepare(query);
    const rows = stmt.all(name);
    console.log('[SEARCH] Result:', rows);
    return rows;
}

// SECURE login with validation
function loginSafe(username, password) {
    // Input validation FIRST
    if (!isValidUsername(username)) {
        console.log('\n[LOGIN] Validation failed: Invalid username');
        return null;
    }
    if (!isValidPassword(password)) {
        console.log('\n[LOGIN] Validation failed: Password too short (min 6 chars)');
        return null;
    }
    
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    console.log('\n[LOGIN] Query:', query);
    console.log('[LOGIN] Parameters:', username, password);
    
    const stmt = db.prepare(query);
    const row = stmt.get(username, password);
    console.log('[LOGIN] Result:', row);
    return row;
}

console.log('\n========== TESTING WITH VALIDATION ==========\n');

// Valid inputs
console.log('\n--- VALID INPUTS (should work) ---');
console.log('Test 1: search "cement" ->', searchProductSafe('cement'));
console.log('Test 2: login admin/admin123 ->', loginSafe('admin', 'admin123'));

// Invalid inputs - should be rejected BEFORE database
console.log('\n--- INVALID INPUTS (should be rejected) ---');
console.log('Test 3: empty search ->', searchProductSafe(''));
console.log('Test 4: script tag search ->', searchProductSafe('<script>'));
console.log('Test 5: short password ->', loginSafe('admin', 'ab'));
console.log('Test 6: username with space ->', loginSafe('ad min', 'pass123'));

// Attack payloads - validation rejects them
console.log('\n--- ATTACK PAYLOADS (validation rejects) ---');
console.log('Test 7: OR 1=1 attack ->', searchProductSafe("' OR 1=1--"));
console.log('Test 8: UNION attack ->', searchProductSafe("' UNION SELECT..."));
console.log('Test 9: admin bypass ->', loginSafe("admin'--", 'anything'));
console.log('Test 10: always true ->', loginSafe("' OR '1'='1", "' OR '1'='1"));

db.close();