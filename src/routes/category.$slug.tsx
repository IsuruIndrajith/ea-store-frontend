import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, categoriesQuery } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context, params }) => {
    const cats = await context.queryClient.ensureQueryData(categoriesQuery());
    const cat = cats.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    return cat;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Category"} — EA Store` },
      { name: "description", content: `Browse ${loaderData?.name ?? ""} products for MT4 and MT5.` },
      { property: "og:title", content: `${loaderData?.name ?? "Category"} — EA Store` },
      { property: "og:description", content: `Browse ${loaderData?.name ?? ""} products for MT4 and MT5.` },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="py-24 text-center">Category not found. <Link to="/shop" className="text-primary">Go to shop</Link></div>
  ),
  errorComponent: ({ error }) => <div className="py-24 text-center">{error instanceof Error ? error.message : String(error)}</div>,
});

function CategoryPage() {
  const cat = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productsQuery());
  const list = products.filter((p) => p.categories.includes(cat.slug));
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm text-muted-foreground">Category</p>
      <h1 className="text-4xl font-bold">{cat.name}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
