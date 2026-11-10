import { Link } from "@tanstack/react-router";
import { ShoppingCart, Bot, UserRound } from "lucide-react";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold text-primary-foreground">
            <Bot className="h-5 w-5" />
          </span>
          EA <span className="text-gold">Store</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="hover:text-primary"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary" }}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Shop
          </Link>
          <Link
            to="/category/$slug"
            params={{ slug: "gold-ea" }}
            className="hidden hover:text-primary sm:inline"
          >
            Gold EAs
          </Link>
          <Link
            to="/account"
            className="rounded-lg border p-2 hover:border-primary"
            aria-label="Account"
          >
            <UserRound className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            className="relative rounded-lg border p-2 hover:border-primary"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm text-muted-foreground sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-foreground">
            EA <span className="text-gold">Store</span>
          </p>
          <p className="mt-2">Expert Advisors, indicators and trading tools for MT4 & MT5.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/shop" className="hover:text-primary">
            All products
          </Link>
          <Link to="/cart" className="hover:text-primary">
            Cart
          </Link>
        </div>
        <p>Trading involves risk. Past performance does not guarantee future results.</p>
      </div>
    </footer>
  );
}
