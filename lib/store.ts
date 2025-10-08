import { produce } from "immer";
import { create } from "zustand";

export type Produto = {
  id: string;
  nome: string;
  sku: string;
  estoque: number;
};
export type Movimento = {
  id: string;
  sku: string;
  quantidade: number;
  tipo: "ENTRADA" | "SAIDA";
  data: string;
};

type State = {
  produtos: Produto[];
  movimentos: Movimento[];
  addProduto: (p: { nome: string; sku: string; estoque: number }) => boolean;
  movimentar: (m: { sku: string; quantidade: number; tipo: "ENTRADA" | "SAIDA" }) => boolean;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const useStore = create<State>((set, get) => ({
  produtos: [
    { id: uid(), nome: "Caderno", sku: "CAD-001", estoque: 10 },
    { id: uid(), nome: "Lápis HB", sku: "LAP-123", estoque: 50 }
  ],
  movimentos: [],
  addProduto: ({ nome, sku, estoque }) => {
    if (!nome || !sku) return false;
    set(produce((s: State) => {
      s.produtos.push({ id: uid(), nome, sku, estoque });
    }));
    return true;
  },
  movimentar: ({ sku, quantidade, tipo }) => {
    if (!sku || !quantidade) return false;
    const produto = get().produtos.find(p => p.sku.toUpperCase() === sku.toUpperCase());
    if (!produto) return false;
    set(produce((s: State) => {
      const mov: Movimento = { id: uid(), sku: produto.sku, quantidade, tipo, data: new Date().toISOString() };
      s.movimentos.push(mov);
      if (tipo === "ENTRADA") produto.estoque += quantidade;
      if (tipo === "SAIDA")   produto.estoque = Math.max(0, produto.estoque - quantidade);
    }));
    return true;
  }
}));
