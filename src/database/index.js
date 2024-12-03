import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';

const db = new Database('finance.db');

export function initializeDatabase() {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        balance INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Assets table
    db.exec(`
      CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User assets table
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_assets (
        user_id TEXT,
        asset_id INTEGER,
        acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (asset_id) REFERENCES assets(id),
        PRIMARY KEY (user_id, asset_id)
      )
    `);

    // Transactions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user_id TEXT,
        to_user_id TEXT,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_user_id) REFERENCES users(user_id),
        FOREIGN KEY (to_user_id) REFERENCES users(user_id)
      )
    `);

    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
}

export const queries = {
  getBalance: db.prepare('SELECT balance FROM users WHERE user_id = ?'),
  updateBalance: db.prepare('UPDATE users SET balance = ? WHERE user_id = ?'),
  createUser: db.prepare('INSERT OR IGNORE INTO users (user_id, balance) VALUES (?, 0)'),
  addTransaction: db.prepare(`
    INSERT INTO transactions (from_user_id, to_user_id, amount, type)
    VALUES (?, ?, ?, ?)
  `),
  getAssets: db.prepare('SELECT * FROM assets WHERE id IN (SELECT asset_id FROM user_assets WHERE user_id = ?)'),
  createAsset: db.prepare('INSERT INTO assets (name, value) VALUES (?, ?)'),
  assignAsset: db.prepare('INSERT INTO user_assets (user_id, asset_id) VALUES (?, ?)')
};