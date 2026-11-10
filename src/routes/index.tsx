import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, RefreshCw, Zap, Headphones } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { productsQuery, categoriesQuery } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EA Store — Trade Smarter With Forex Expert Advisors" },
      {
        name: "description",
        content:
          "Professional Forex EAs, MT4/MT5 indicators and trading tools at discounted prices.",
      },
      { property: "og:title", content: "EA Store — Trade Smarter With Forex EAs" },
      {
        property: "og:description",
        content: "Professional Forex EAs, MT4/MT5 indicators and trading tools.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery()),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ]);
  },
  component: Index,
});

const faqs = [
  [
    "What is an Expert Advisor?",
    "An EA is an automated trading program that runs inside MetaTrader 4 or 5 and opens/closes trades for you.",
  ],
  [
    "How do I receive my EA?",
    "After checkout you get an instant download link plus set files and an installation guide.",
  ],
  ["Do updates cost extra?", "No. Every purchase includes free lifetime updates."],
];

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: cats } = useSuspenseQuery(categoriesQuery());
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-4 inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-widest text-primary">
            Smart Forex Trading Solutions
          </p>
          <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl">
            Trade Smarter With <span className="text-gold">Powerful Forex EAs</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Professionally developed Expert Advisors, MT4/MT5 indicators and trading tools designed
            to simplify your trading.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/shop"
              className="rounded-lg bg-gold px-6 py-3 font-semibold text-primary-foreground shadow-gold"
            >
              Explore EAs
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: "gold-ea" }}
              className="rounded-lg border px-6 py-3 font-semibold hover:border-primary"
            >
              Gold EAs
            </Link>
          </div>
          <div className="mt-10 flex gap-8">
            {[
              ["MT4", "Supported"],
              ["MT5", "Supported"],
              ["24/7", "Access"],
            ].map(([a, b]) => (
              <div key={a}>
                <p className="font-display text-2xl font-bold">{a}</p>
                <p className="text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <img
            src={hero}
            alt="Gold trading chart with AI"
            width={1280}
            height={960}
            className="rounded-2xl border"
          />
          <div className="absolute -bottom-6 left-6 rounded-xl border bg-card/90 p-4 backdrop-blur sm:w-72">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold">Trading Performance</p>
              <span className="flex items-center gap-1 text-xs text-gain">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gain" />
                LIVE
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Growth</p>
                <p className="font-bold text-gain">+24.86%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Market</p>
                <p className="font-bold">XAUUSD</p>
              </div>
              <div>
                <p className="text-muted-foreground">Platform</p>
                <p className="font-bold">MT5</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-bold">Active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="rounded-full border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold">Best Forex EA 2026</h2>
          <Link to="/shop" className="text-sm text-primary">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Zap, "Instant delivery", "Download right after payment."],
          [RefreshCw, "Free updates", "Lifetime version upgrades."],
          [ShieldCheck, "Secure checkout", "Encrypted payments."],
          [Headphones, "24/7 support", "Help with install & setup."],
        ].map(([Icon, t, d]) => {
          const I = Icon as typeof Zap;
          return (
            <div key={t as string} className="rounded-2xl border bg-card p-6">
              <I className="h-6 w-6 text-primary" />
              <p className="mt-4 font-display font-semibold">{t as string}</p>
              <p className="text-sm text-muted-foreground">{d as string}</p>
            </div>
          );
        })}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="mb-6 text-center text-3xl font-bold">FAQ</h2>
        {faqs.map(([q, a]) => (
          <details key={q} className="mb-3 rounded-xl border bg-card p-5">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
