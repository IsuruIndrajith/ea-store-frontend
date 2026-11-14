import { Link } from "@tanstack/react-router";
import { ShoppingCart, UserRound } from "lucide-react";
import { useCart } from "@/lib/cart";

/** Inline SVG matching the ForexEA360 logo — partial-circle frame + ascending candlesticks */
function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ~300° arc — gap at bottom-right (~4–5 o'clock) */}
      <circle
        cx="18"
        cy="18"
        r="13.5"
        stroke="white"
        strokeWidth="1.9"
        fill="none"
        strokeDasharray="72 13"
        strokeDashoffset="21"
        strokeLinecap="round"
      />
      {/* Candle 1 — bearish, low-left */}
      <line x1="8.5"  y1="27"   x2="8.5"  y2="22"  stroke="rgba(255,255,255,0.55)" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="7"    y="22.5"  width="3" height="3"   fill="rgba(255,255,255,0.55)" rx="0.4" />
      {/* Candle 2 — bullish */}
      <line x1="13"   y1="25"   x2="13"   y2="20"  stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="11.5" y="20.5"  width="3" height="3.5" fill="rgba(255,255,255,0.75)" rx="0.4" />
      {/* Candle 3 — bullish */}
      <line x1="17.5" y1="22.5" x2="17.5" y2="17"  stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="16"   y="17.5"  width="3" height="4"   fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.1" rx="0.4" />
      {/* Candle 4 — teal, bullish, tallest */}
      <line x1="22.5" y1="20"   x2="22.5" y2="13"  stroke="#00E5A0" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="21"   y="13.5"  width="3" height="5.5" fill="#00E5A0" rx="0.4" />
    </svg>
  );
}

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <LogoMark />
          <span className="font-display text-[1.15rem] font-bold leading-none tracking-tight">
            Forex<span className="text-primary">EA</span>360
          </span>
        </Link>

        {/* Primary nav (desktop) */}
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link
            to="/shop"
            className="transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Expert Advisors
          </Link>
          <span className="cursor-default transition-colors hover:text-foreground">Guides</span>
          <span className="cursor-default transition-colors hover:text-foreground">Reviews</span>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/account"
            className="rounded-lg border border-border/60 p-2 text-muted-foreground transition hover:border-primary hover:text-primary"
            aria-label="Account"
          >
            <UserRound className="h-[1.1rem] w-[1.1rem]" />
          </Link>
          <Link
            to="/cart"
            className="relative rounded-lg border border-border/60 p-2 text-muted-foreground transition hover:border-primary hover:text-primary"
            aria-label="Cart"
          >
            <ShoppingCart className="h-[1.1rem] w-[1.1rem]" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/shop"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <LogoMark size={28} />
            <span className="font-display text-base font-bold leading-none">
              Forex<span className="text-primary">EA</span>360
            </span>
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link to="/shop"  className="transition hover:text-primary">Expert Advisors</Link>
            <Link to="/shop"  className="transition hover:text-primary">Guides</Link>
            <Link to="/shop"  className="transition hover:text-primary">Reviews</Link>
            <Link to="/cart"  className="transition hover:text-primary">Cart</Link>
            <Link to="/account" className="transition hover:text-primary">Account</Link>
          </nav>
        </div>
        <p className="text-xs text-muted-foreground">
          Trading forex involves significant risk and may not be suitable for everyone.
          Past performance does not guarantee future results. &nbsp;ForexEA360 - All right reserved. ©2026
        </p>
      </div>
    </footer>
  );
}
