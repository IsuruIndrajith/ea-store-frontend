import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { productsQuery, categoriesQuery } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ForexEA360 — Automate Your Forex Strategy" },
      {
        name: "description",
        content:
          "Discover, test and run Expert Advisors for MT4 and MT5 with professional guides and tools.",
      },
      { property: "og:title", content: "ForexEA360 — Automate Your Forex Strategy" },
      {
        property: "og:description",
        content: "Professional Forex EAs, indicators and trading tools.",
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

// ─── Chart illustration ───────────────────────────────────────────────────────

function ChartIllustration() {
  // Each candle: [x, wickTop, bodyTop, bodyBottom, wickBottom, bullish]
  const candles: [number, number, number, number, number, boolean][] = [
    [32,  208, 210, 218, 220, false],
    [62,  200, 196, 207, 210, true ],
    [92,  191, 187, 198, 202, true ],
    [122, 180, 177, 188, 192, true ],
    [152, 168, 165, 176, 181, true ],
    [182, 154, 151, 162, 168, true ],
    [212, 139, 136, 148, 154, true ],
    [242, 121, 118, 132, 139, true ],
    [272, 102, 99,  114, 121, true ],
    [302, 80,  77,  94,  102, true ],
    [332, 55,  52,  70,  80,  true ],
    [362, 30,  27,  46,  55,  true ],
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
      {/* Subtle grid */}
      <svg viewBox="0 0 400 240" className="w-full" aria-hidden="true">
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="0" y1={i * 56 + 16}
            x2="400" y2={i * 56 + 16}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Dashed trend line */}
        <polyline
          points="32,214 92,195 152,172 212,142 272,110 332,65 380,32"
          fill="none"
          stroke="#00E5A0"
          strokeWidth="1.8"
          strokeDasharray="6 5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Candlesticks */}
        {candles.map(([x, wt, bt, bb, wb, bull]) => (
          <g key={x}>
            {/* Wick */}
            <line
              x1={x} y1={wt} x2={x} y2={wb}
              stroke={bull ? "#00E5A0" : "rgba(255,255,255,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Body */}
            <rect
              x={x - 7}
              y={bt}
              width={14}
              height={Math.max(bb - bt, 2)}
              rx="2"
              fill={bull ? "rgba(0,229,160,0.85)" : "rgba(255,255,255,0.12)"}
              stroke={bull ? "#00E5A0" : "rgba(255,255,255,0.35)"}
              strokeWidth="1"
            />
          </g>
        ))}
      </svg>
      <p className="mt-2 text-center text-xs text-muted-foreground">Illustrative chart only.</p>
    </div>
  );
}

// ─── How it works steps ───────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    title: "Browse Expert Advisors",
    desc: "Explore EAs for MetaTrader by strategy, pair and timeframe, with clear descriptions.",
  },
  {
    num: "02",
    title: "Test before you trade",
    desc: "Compare backtests and run any EA on a demo account first.",
  },
  {
    num: "03",
    title: "Set up with confidence",
    desc: "Step-by-step guides for installing, configuring and monitoring your EA.",
  },
];

const faqs = [
  [
    "What is an Expert Advisor?",
    "An EA is an automated trading program that runs inside MetaTrader 4 or 5 and opens/closes trades automatically according to its strategy.",
  ],
  [
    "How do I receive my EA?",
    "After checkout you get an instant download link plus optimised set files and a step-by-step installation guide.",
  ],
  ["Do updates cost extra?", "No. Every purchase includes free lifetime updates and support."],
];

// ─── Page component ───────────────────────────────────────────────────────────

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: cats } = useSuspenseQuery(categoriesQuery());

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">
              Smart Forex Trading Solutions
            </span>
          </div>
          <h1 className="text-5xl font-bold leading-[1.08] sm:text-[3.5rem]">
            Automate your<br />
            forex strategy,<br />
            <span className="text-primary">around the clock.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Discover, test and run Expert Advisors with the guides and tools to use them well.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Browse Expert Advisors
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition hover:border-primary hover:text-primary"
            >
              How it works <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <ChartIllustration />
      </section>

      {/* ── Category chips ────────────────────────────────────────────────── */}
      {cats.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-border/60 bg-card p-6 transition hover:border-primary/40"
            >
              <p className="font-display text-sm font-semibold text-primary/60">{s.num}</p>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-bold">Top Expert Advisors</h2>
            <Link to="/shop" className="text-sm text-primary transition hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Trust bar ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["⚡", "Instant delivery", "Download right after payment."],
            ["🔄", "Free updates", "Lifetime version upgrades."],
            ["🔒", "Secure checkout", "Encrypted payments."],
            ["💬", "24/7 support", "Help with install & setup."],
          ].map(([icon, t, d]) => (
            <div key={t} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5">
              <span className="text-2xl leading-none">{icon}</span>
              <div>
                <p className="font-display font-semibold text-sm">{t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
        {faqs.map(([q, a]) => (
          <details
            key={q}
            className="mb-3 rounded-xl border border-border/60 bg-card p-5 open:border-primary/40"
          >
            <summary className="cursor-pointer select-none font-semibold">{q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
