import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { discount, money } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductArt({ p, large = false }: { p: Product; large?: boolean }) {
  return (
    <div
      className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl p-5"
      style={{
        background: `radial-gradient(circle at 30% 20%, oklch(0.55 0.15 ${p.hue}), oklch(0.2 0.04 ${p.hue}) 70%)`,
      }}
    >
      <span className="w-fit rounded-md bg-background/60 px-2 py-1 text-xs font-semibold backdrop-blur">
        {p.platform}
      </span>
      <div>
        <p className={`font-display font-bold leading-tight ${large ? "text-4xl" : "text-xl"}`}>
          {p.name}
        </p>
        <p className="text-sm text-foreground/70">
          {p.market} · {p.version}
        </p>
      </div>
      {p.growth > 0 && (
        <span className="absolute right-4 top-4 rounded-md bg-background/60 px-2 py-1 text-xs font-bold text-gain backdrop-blur">
          +{p.growth}%
        </span>
      )}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <div className="group relative flex flex-col rounded-2xl border bg-card p-3 transition hover:-translate-y-1 hover:shadow-gold">
      <span className="absolute left-5 top-5 z-10 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
        -{discount(p)}%
      </span>
      <Link to="/product/$slug" params={{ slug: p.slug }}>
        <ProductArt p={p} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-2 pt-4">
        <Link
          to="/product/$slug"
          params={{ slug: p.slug }}
          className="font-display font-semibold hover:text-primary"
        >
          {p.name} {p.version}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {p.rating} ({p.reviews})
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground line-through">{money(p.price)}</p>
            <p className="text-lg font-bold text-primary">{money(p.sale_price)}</p>
          </div>
          <button
            disabled={p.is_purchasable === false}
            onClick={() => {
              add(p.slug);
              toast.success(`${p.name} added to cart`);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />{" "}
            {p.is_purchasable === false ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
