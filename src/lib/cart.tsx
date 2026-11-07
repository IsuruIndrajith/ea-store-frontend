import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  slug: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ea-store-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
  }, []);
  const save = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };
  const value: CartCtx = {
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    add: (slug) => {
      const ex = items.find((i) => i.slug === slug);
      save(ex ? items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i)) : [...items, { slug, qty: 1 }]);
    },
    setQty: (slug, qty) => save(items.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))),
    remove: (slug) => save(items.filter((i) => i.slug !== slug)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
