const Database = require('better-sqlite3');
const db = new Database('tickets.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    used INTEGER NOT NULL DEFAULT 0
  )
`);


module.exports = db;