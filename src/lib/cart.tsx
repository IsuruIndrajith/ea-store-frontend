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
  clear: () => void;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ea-store-cart";
const MAX_QUANTITY = 10;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const restored: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(restored)) throw new Error("Stored cart must be an array.");
      setItems(
        restored
          .filter(
            (item): item is CartItem =>
              typeof item === "object" &&
              item !== null &&
              "slug" in item &&
              typeof item.slug === "string" &&
              item.slug.length > 0 &&
              "qty" in item &&
              typeof item.qty === "number" &&
              Number.isInteger(item.qty) &&
              item.qty >= 1,
          )
          .map((item) => ({ ...item, qty: Math.min(MAX_QUANTITY, item.qty) })),
      );
    } catch (error) {
      console.error("Could not restore the cart from browser storage.", error);
      localStorage.removeItem(KEY);
    }
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
      save(
        ex
          ? items.map((i) =>
              i.slug === slug ? { ...i, qty: Math.min(MAX_QUANTITY, i.qty + 1) } : i,
            )
          : [...items, { slug, qty: 1 }],
      );
    },
    setQty: (slug, qty) => {
      if (!Number.isFinite(qty)) return;
      save(
        items.map((i) =>
          i.slug === slug ? { ...i, qty: Math.min(MAX_QUANTITY, Math.max(1, Math.floor(qty))) } : i,
        ),
      );
    },
    remove: (slug) => save(items.filter((i) => i.slug !== slug)),
    clear: () => save([]),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
