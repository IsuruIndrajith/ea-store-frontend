import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { productsQuery, money } from "@/lib/api";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — EA Store" },
      { name: "description", content: "Review the Expert Advisors in your cart." },
      { property: "og:title", content: "Your Cart — EA Store" },
      { property: "og:description", content: "Review the Expert Advisors in your cart." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(productsQuery()); },
  component: CartPage,
});

function CartPage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { items, setQty, remove } = useCart();
  const lines = items.flatMap((i) => {
    const p = products.find((x) => x.slug === i.slug);
    return p ? [{ ...i, p }] : [];
  });
  const total = lines.reduce((s, l) => s + l.p.sale_price * l.qty, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">Cart</h1>
      {lines.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Your cart is empty. <Link to="/shop" className="text-primary">Browse EAs</Link></p>
      ) : (
        <>
          <div className="mt-8 divide-y rounded-2xl border bg-card">
            {lines.map(({ p, qty }) => (
              <div key={p.slug} className="flex items-center gap-4 p-4">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="flex-1 font-semibold hover:text-primary">{p.name} {p.version}</Link>
                <input type="number" min={1} value={qty} onChange={(e) => setQty(p.slug, Number(e.target.value))} className="w-16 rounded-lg border bg-background px-2 py-1" />
                <span className="w-24 text-right font-bold">{money(p.sale_price * qty)}</span>
                <button onClick={() => remove(p.slug)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xl">Total: <span className="font-bold text-primary">{money(total)}</span></p>
            <button onClick={() => toast("Checkout will connect to your Laravel API.")} className="rounded-lg bg-gold px-6 py-3 font-semibold text-primary-foreground">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
