import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ShoppingCart, Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { productQuery, productsQuery, discount, money } from "@/lib/api";
import type { ProductExtended, SetReviewData, ProductFaq, SetFile } from "@/lib/api";
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
      {
        title: loaderData
          ? `${loaderData.meta_title ?? loaderData.name + " " + loaderData.version} — EA Store`
          : "Product — EA Store",
      },
      {
        name: "description",
        content: loaderData?.meta_description ?? loaderData?.description.slice(0, 155) ?? "",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.name} — EA Store` : "Product — EA Store",
      },
      {
        property: "og:description",
        content: loaderData?.meta_description ?? loaderData?.description.slice(0, 155) ?? "",
      },
      { property: "og:type", content: "product" },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="py-24 text-center">
      Product not found.{" "}
      <Link to="/shop" className="text-primary">
        Back to shop
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="py-24 text-center">
      {error instanceof Error ? error.message : String(error)}
    </div>
  ),
});

const tabs = ["Description", "Features", "Set Review", "Install Guide"] as const;
type Tab = (typeof tabs)[number];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FaqList({ faqs }: { faqs: ProductFaq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!faqs.length) return null;
  return (
    <div className="mt-6 space-y-2">
      <h3 className="font-semibold text-foreground mb-3">Frequently Asked Questions</h3>
      {faqs.map((faq, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-4 py-3 font-medium text-sm flex justify-between items-center hover:bg-muted/50"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {faq.question}
            <span className="ml-2 text-muted-foreground">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TextBlock({ value }: { value: unknown }) {
  if (!value) return null;
  if (typeof value === "string") return <p className="leading-relaxed">{value}</p>;
  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>;
    const text = (v.title ?? v.text ?? v.step ?? "") as string;
    return <p className="leading-relaxed">{text}</p>;
  }
  return null;
}

function BulletList({ items, className }: { items: unknown[]; className?: string }) {
  if (!items?.length) return null;
  return (
    <ul className={`space-y-2 ${className ?? ""}`}>
      {items.map((item, i) => {
        const text =
          typeof item === "string"
            ? item
            : ((item as Record<string, unknown>)?.title ??
              (item as Record<string, unknown>)?.text ??
              (item as Record<string, unknown>)?.step ??
              "") as string;
        return (
          <li key={i} className="flex gap-2 text-sm">
            <Check className="h-4 w-4 text-gain mt-0.5 flex-shrink-0" />
            <span>{text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function SimpleTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows?.length) return null;
  const keys = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {keys.map((k) => (
              <th
                key={k}
                className="text-left px-3 py-2 border-b bg-muted/30 font-medium capitalize"
              >
                {k.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
              {keys.map((k) => (
                <td key={k} className="px-3 py-2 text-muted-foreground">
                  {String(row[k] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab contents ─────────────────────────────────────────────────────────────

function DescriptionTab({ ext, description }: { ext?: ProductExtended; description: string }) {
  if (!ext?.intro && !ext?.key_features && !ext?.why_buy_this) {
    return <p className="max-w-3xl leading-relaxed">{description}</p>;
  }
  return (
    <div className="max-w-3xl space-y-8">
      {ext.intro && (
        <section>
          <p className="leading-relaxed">{ext.intro}</p>
        </section>
      )}
      {ext.first_hand_test_results && (
        <section>
          <h3 className="font-semibold text-foreground mb-2">First-Hand Test Results</h3>
          <p className="leading-relaxed text-muted-foreground">{ext.first_hand_test_results}</p>
        </section>
      )}
      {!!ext.key_features?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Key Features</h3>
          <BulletList items={ext.key_features} />
        </section>
      )}
      {!!ext.why_buy_this?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Why Buy This EA?</h3>
          <BulletList items={ext.why_buy_this} />
        </section>
      )}
      {ext.honest_limitation && (
        <section>
          <h3 className="font-semibold text-foreground mb-2">Honest Limitations</h3>
          <p className="leading-relaxed text-muted-foreground">{ext.honest_limitation}</p>
        </section>
      )}
      {ext.why_different && (
        <section>
          <h3 className="font-semibold text-foreground mb-2">What Makes It Different</h3>
          <p className="leading-relaxed text-muted-foreground">{ext.why_different}</p>
        </section>
      )}
      {!!ext.strategy_logic?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Strategy Logic</h3>
          <BulletList items={ext.strategy_logic} />
        </section>
      )}
      {!!ext.risk_controls?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Risk Controls</h3>
          <BulletList items={ext.risk_controls} />
        </section>
      )}
      {ext.is_it_worth_it && (
        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-2">Is It Worth It?</h3>
          <p className="leading-relaxed text-muted-foreground">{ext.is_it_worth_it}</p>
        </section>
      )}
      {ext.risk_disclaimer_line && (
        <p className="text-xs text-muted-foreground border-t pt-4">{ext.risk_disclaimer_line}</p>
      )}
      {!!ext.faqs?.length && <FaqList faqs={ext.faqs} />}
    </div>
  );
}

function FeaturesTab({ features, ext }: { features: string[]; ext?: ProductExtended }) {
  return (
    <div className="max-w-3xl space-y-6">
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2 text-sm">
            <Check className="h-4 w-4 text-gain mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      {!!ext?.optimized_settings_table?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Optimized Settings</h3>
          <SimpleTable rows={ext.optimized_settings_table as Record<string, unknown>[]} />
        </section>
      )}
    </div>
  );
}

function SetReviewTab({ sr, vendorUrl }: { sr?: SetReviewData; vendorUrl?: string }) {
  if (!sr) {
    return (
      <p className="text-muted-foreground">
        Set file review not yet published for this EA.{" "}
        {vendorUrl && (
          <a
            href={vendorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1"
          >
            View vendor page <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </p>
    );
  }
  return (
    <div className="max-w-3xl space-y-8">
      {sr.seo_introduction && (
        <p className="leading-relaxed text-muted-foreground">{sr.seo_introduction}</p>
      )}
      {!!sr.specs_table?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">EA Specifications</h3>
          <SimpleTable rows={sr.specs_table as Record<string, unknown>[]} />
        </section>
      )}
      {!!sr.requirements_table?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Requirements</h3>
          <SimpleTable rows={sr.requirements_table as Record<string, unknown>[]} />
        </section>
      )}
      {!!sr.important_parameters?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Important Parameters</h3>
          <SimpleTable rows={sr.important_parameters as Record<string, unknown>[]} />
        </section>
      )}
      {!!sr.set_files?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Set Files</h3>
          <div className="space-y-4">
            {sr.set_files.map((sf: SetFile, i: number) => (
              <div key={i} className="rounded-xl border bg-card p-4">
                <p className="font-medium">{sf.name}</p>
                {sf.purpose && (
                  <p className="text-sm text-muted-foreground mt-1">{sf.purpose}</p>
                )}
                {sf.differences && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Differences: </span>
                    <span className="text-muted-foreground">{sf.differences}</span>
                  </p>
                )}
                {sf.limitations && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Limitations: </span>
                    <span className="text-muted-foreground">{sf.limitations}</span>
                  </p>
                )}
                {!!sf.risk_params?.length && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Risk params:</p>
                    <div className="flex flex-wrap gap-1">
                      {sf.risk_params.map((rp, j) => (
                        <span
                          key={j}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full"
                        >
                          {rp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {!!sr.set_comparison_table?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Set File Comparison</h3>
          <SimpleTable rows={sr.set_comparison_table as Record<string, unknown>[]} />
        </section>
      )}
      {!!sr.load_set_steps?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">How to Load a Set File</h3>
          <ol className="space-y-2">
            {sr.load_set_steps.map((step, i) => {
              const text =
                typeof step === "string"
                  ? step
                  : ((step as Record<string, unknown>)?.step ??
                    (step as Record<string, unknown>)?.text ??
                    "") as string;
              return (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{text}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}
      {!!sr.customization_guidance?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Customization Guidance</h3>
          <BulletList items={sr.customization_guidance} />
        </section>
      )}
      {!!sr.who_should_use?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Who Should Use This</h3>
          <BulletList items={sr.who_should_use} />
        </section>
      )}
      {sr.final_verdict && (
        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-2">Final Verdict</h3>
          <p className="leading-relaxed text-muted-foreground">{sr.final_verdict}</p>
        </section>
      )}
      {sr.risk_disclaimer && (
        <p className="text-xs text-muted-foreground border-t pt-4">{sr.risk_disclaimer}</p>
      )}
      {!!sr.faqs?.length && <FaqList faqs={sr.faqs} />}
    </div>
  );
}

function InstallGuideTab({ ext }: { ext?: ProductExtended }) {
  if (!ext?.install_steps?.length && !ext?.load_set_steps) {
    return (
      <p className="text-muted-foreground">
        Installation guide will appear here once the product page is published.
      </p>
    );
  }
  return (
    <div className="max-w-3xl space-y-6">
      {!!ext.install_steps?.length && (
        <section>
          <h3 className="font-semibold text-foreground mb-3">Installation Steps</h3>
          <ol className="space-y-3">
            {ext.install_steps.map((step, i) => {
              const text =
                typeof step === "string"
                  ? step
                  : ((step as Record<string, unknown>)?.step ??
                    (step as Record<string, unknown>)?.text ??
                    "") as string;
              return (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-muted-foreground">{text}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}
      {ext.telegram_support_line && (
        <section className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          {ext.telegram_support_line}
        </section>
      )}
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

function ProductPage() {
  const p = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(productsQuery());
  const { add } = useCart();
  const [tab, setTab] = useState<Tab>("Description");
  const related = all
    .filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c)))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductArt p={p} large />
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
              -{discount(p)}%
            </span>
            <span className="rounded-full border px-3 py-1 text-xs">{p.platform}</span>
            <span className="rounded-full border px-3 py-1 text-xs">{p.market}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold">
            {p.name} {p.version}
          </h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" /> {p.rating} · {p.reviews} reviews
          </div>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-bold text-primary">{money(p.sale_price)}</span>
            <span className="pb-1 text-lg text-muted-foreground line-through">
              {money(p.price)}
            </span>
          </div>
          {p.growth > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Growth", `+${p.growth}%`],
                ["Max DD", `${p.drawdown}%`],
                ["Platform", p.platform],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border bg-card p-3">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className={`font-bold ${k === "Growth" ? "text-gain" : ""}`}>{v}</p>
                </div>
              ))}
            </div>
          )}
          <button
            disabled={p.is_purchasable === false}
            onClick={() => {
              add(p.slug);
              toast.success(`${p.name} added to cart`);
            }}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-4 font-semibold text-primary-foreground shadow-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />{" "}
            {p.is_purchasable === false ? "Unavailable" : "Add to Cart"}
          </button>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {p.features.slice(0, 3).map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="h-4 w-4 text-gain" />
                {f}
              </li>
            ))}
          </ul>
          {p.vendor_url && (
            <a
              href={p.vendor_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              View on vendor site <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-2 border-b overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-8 text-muted-foreground">
          {tab === "Description" && (
            <DescriptionTab ext={p.extended} description={p.description} />
          )}
          {tab === "Features" && <FeaturesTab features={p.features} ext={p.extended} />}
          {tab === "Set Review" && (
            <SetReviewTab sr={p.set_review_data} vendorUrl={p.vendor_url} />
          )}
          {tab === "Install Guide" && <InstallGuideTab ext={p.extended} />}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">Related products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
