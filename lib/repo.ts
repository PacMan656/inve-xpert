import { db } from './sqlite';

function uid() { return Math.random().toString(36).slice(2, 10); }

export type Product = { id: string; name: string; sku: string; stock: number; created_at: string };
export type Movement = { id: string; product_id: string; sku: string; qty: number; type: 'ENTRADA'|'SAIDA'; at: string };

export function seedIfEmpty() {
  const row = db.getFirstSync<{ count: number }>(`SELECT COUNT(*) as count FROM products`);
  if ((row?.count ?? 0) === 0) {
    const now = new Date().toISOString();
    db.runSync(`INSERT INTO products (id,name,sku,stock,created_at) VALUES (?,?,?,?,?)`, uid(), 'Caderno', 'CAD-001', 10, now);
    db.runSync(`INSERT INTO products (id,name,sku,stock,created_at) VALUES (?,?,?,?,?)`, uid(), 'Lápis HB', 'LAP-123', 50, now);
  }
}

export function listProducts(): Product[] {
  return db.getAllSync<Product>(`SELECT * FROM products ORDER BY created_at DESC`);
}

export function getProduct(id: string): Product | undefined {
  return db.getFirstSync<Product>(`SELECT * FROM products WHERE id = ?`, id) ?? undefined;
}

export function getProductBySku(sku: string): Product | undefined {
  return db.getFirstSync<Product>(`SELECT * FROM products WHERE UPPER(sku) = UPPER(?)`, sku) ?? undefined;
}

export function addProduct(input: { name: string; sku: string; stock: number }) {
  const id = uid();
  const now = new Date().toISOString();
  db.runSync(`INSERT INTO products (id,name,sku,stock,created_at) VALUES (?,?,?,?,?)`, id, input.name, input.sku.toUpperCase(), Math.max(0, input.stock||0), now);
  return id;
}

export function listMovements(): Movement[] {
  return db.getAllSync<Movement>(`SELECT * FROM movements ORDER BY at DESC`);
}

export function addMovementTx(input: { product_id: string; sku: string; qty: number; type: 'ENTRADA'|'SAIDA' }) {
  const id = uid();
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    const prod = db.getFirstSync<Product>(`SELECT * FROM products WHERE id = ?`, input.product_id);
    if (!prod) throw new Error('Produto não encontrado');
    let newStock = prod.stock;
    if (input.type === 'ENTRADA') newStock += input.qty; else newStock = Math.max(0, newStock - input.qty);
    db.runSync(`UPDATE products SET stock = ? WHERE id = ?`, newStock, prod.id);
    db.runSync(`INSERT INTO movements (id,product_id,sku,qty,type,at) VALUES (?,?,?,?,?,?)`, id, prod.id, prod.sku, input.qty, input.type, now);
  });
}

export function kpis() {
  const p = db.getFirstSync<{ c:number; s:number }>(`SELECT COUNT(*) as c, COALESCE(SUM(stock),0) as s FROM products`)!;
  const e = db.getFirstSync<{ c:number }>(`SELECT COUNT(*) as c FROM movements WHERE type='ENTRADA'`)!;
  const sa = db.getFirstSync<{ c:number }>(`SELECT COUNT(*) as c FROM movements WHERE type='SAIDA'`)!;
  return { produtos: p.c, estoqueTotal: p.s, entradas: e.c, saidas: sa.c };
}

export function exportAll() {
  const produtos = listProducts();
  const movimentos = listMovements();
  return { produtos, movimentos };
}

export function importAll(payload: { produtos: any[]; movimentos: any[] }) {
  db.withTransactionSync(() => {
    db.runSync(`DELETE FROM movements`);
    db.runSync(`DELETE FROM products`);
    for (const p of payload.produtos) {
      db.runSync(`INSERT INTO products (id,name,sku,stock,created_at) VALUES (?,?,?,?,?)`, String(p.id), String(p.name), String(p.sku).toUpperCase(), Number(p.stock)||0, String(p.created_at||new Date().toISOString()));
    }
    for (const m of payload.movimentos) {
      db.runSync(`INSERT INTO movements (id,product_id,sku,qty,type,at) VALUES (?,?,?,?,?,?)`, String(m.id), String(m.product_id), String(m.sku).toUpperCase(), Number(m.qty)||0, (m.type==='SAIDA'?'SAIDA':'ENTRADA'), String(m.at||new Date().toISOString()));
    }
  });
}