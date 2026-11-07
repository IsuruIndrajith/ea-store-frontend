import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { productsQuery, categoriesQuery } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  platform: z.enum(["MT4", "MT5"]).optional(),
  sort: z.enum(["popular", "price-asc", "price-desc"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Shop Forex EAs & Indicators — EA Store" },
      { name: "description", content: "Browse all Expert Advisors and indicators for MT4 and MT5." },
      { property: "og:title", content: "Shop — EA Store" },
      { property: "og:description", content: "Browse all Expert Advisors and indicators for MT4 and MT5." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery());
    context.queryClient.ensureQueryData(categoriesQuery());
  },
  component: Shop,
});

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: cats } = useSuspenseQuery(categoriesQuery());
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Partial<typeof s>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  let list = products.filter(
    (p) =>
      (!s.q || p.name.toLowerCase().includes(s.q.toLowerCase())) &&
      (!s.cat || p.categories.includes(s.cat)) &&
      (!s.platform || p.platform.includes(s.platform)),
  );
  if (s.sort === "price-asc") list = [...list].sort((a, b) => a.sale_price - b.sale_price);
  if (s.sort === "price-desc") list = [...list].sort((a, b) => b.sale_price - a.sale_price);
  if (!s.sort || s.sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);

  const field = "rounded-lg border bg-card px-3 py-2 text-sm";
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold">Shop</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input className={`${field} flex-1`} placeholder="Search EAs…" value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} />
        <select className={field} value={s.cat ?? ""} onChange={(e) => set({ cat: e.target.value || undefined })}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select className={field} value={s.platform ?? ""} onChange={(e) => set({ platform: (e.target.value || undefined) as "MT4" | "MT5" | undefined })}>
          <option value="">All platforms</option><option value="MT4">MT4</option><option value="MT5">MT5</option>
        </select>
        <select className={field} value={s.sort ?? "popular"} onChange={(e) => set({ sort: e.target.value as "popular" })}>
          <option value="popular">Most popular</option><option value="price-asc">Price: low → high</option><option value="price-desc">Price: high → low</option>
        </select>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{list.length} products</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
