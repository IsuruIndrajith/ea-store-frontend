import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { productQuery, productsQuery, discount, money } from "@/lib/api";
import { ProductArt, ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} ${loaderData.version} — EA Store` : "Product — EA Store" },
      { name: "description", content: loaderData?.description.slice(0, 155) ?? "" },
      { property: "og:title", content: loaderData ? `${loaderData.name} — EA Store` : "Product — EA Store" },
      { property: "og:description", content: loaderData?.description.slice(0, 155) ?? "" },
      { property: "og:type", content: "product" },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="py-24 text-center">Product not found. <Link to="/shop" className="text-primary">Back to shop</Link></div>
  ),
  errorComponent: ({ error }) => <div className="py-24 text-center">{error instanceof Error ? error.message : String(error)}</div>,
});

const tabs = ["Description", "Features", "Backtest", "Reviews"] as const;

function ProductPage() {
  const p = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(productsQuery());
  const { add } = useCart();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");
  const related = all.filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c))).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductArt p={p} large />
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">-{discount(p)}%</span>
            <span className="rounded-full border px-3 py-1 text-xs">{p.platform}</span>
            <span className="rounded-full border px-3 py-1 text-xs">{p.market}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold">{p.name} {p.version}</h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" /> {p.rating} · {p.reviews} reviews
          </div>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-bold text-primary">{money(p.sale_price)}</span>
            <span className="pb-1 text-lg text-muted-foreground line-through">{money(p.price)}</span>
          </div>
          {p.growth > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[["Growth", `+${p.growth}%`], ["Max DD", `${p.drawdown}%`], ["Platform", p.platform]].map(([k, v]) => (
                <div key={k} className="rounded-xl border bg-card p-3"><p className="text-xs text-muted-foreground">{k}</p><p className={`font-bold ${k === "Growth" ? "text-gain" : ""}`}>{v}</p></div>
              ))}
            </div>
          )}
          <button
            onClick={() => { add(p.slug); toast.success(`${p.name} added to cart`); }}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-4 font-semibold text-primary-foreground shadow-gold"
          >
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </button>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {p.features.slice(0, 3).map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-gain" />{f}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-2 border-b">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
        <div className="py-8 text-muted-foreground">
          {tab === "Description" && <p className="max-w-3xl leading-relaxed">{p.description}</p>}
          {tab === "Features" && <ul className="space-y-2">{p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-gain" />{f}</li>)}</ul>}
          {tab === "Backtest" && <p>Backtest reports and live signal screenshots will load here from the API.</p>}
          {tab === "Reviews" && <p>{p.reviews} customer reviews · average {p.rating}/5.</p>}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">Related products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
