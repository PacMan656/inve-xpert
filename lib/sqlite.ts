import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('estoque.db');

export function initDb() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS movements (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      qty INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('ENTRADA','SAIDA')),
      at TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
    CREATE INDEX IF NOT EXISTS idx_movements_at ON movements(at DESC);
    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
  `);
}