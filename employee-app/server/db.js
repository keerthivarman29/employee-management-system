const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './data.db';
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Failed to connect to DB:', err);
  else console.log('Connected to SQLite at', DB_PATH);
});
db.run(`CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  position TEXT,
  department TEXT,
  salary REAL,
  joined_at TEXT
)`);
module.exports = db;
