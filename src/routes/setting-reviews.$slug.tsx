import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, ArrowLeft, BookOpen } from "lucide-react";
import { setReviewQuery, productQuery, type SetReview } from "@/lib/api";

export const Route = createFileRoute("/setting-reviews/$slug")({
  validateSearch: (s: Record<string, unknown>) => ({
    preview_token: typeof s["preview_token"] === "string" ? s["preview_token"] : undefined,
  }),
  loaderDeps: ({ search }) => ({ previewToken: search.preview_token }),
  loader: async ({ context, params, deps }) => {
    const sr = await context.queryClient.ensureQueryData(setReviewQuery(params.slug, deps.previewToken));
    if (!sr) throw notFound();
    if (sr.product_slug) {
      await context.queryClient.ensureQueryData(productQuery(sr.product_slug)).catch(() => null);
    }
    return sr;
  },
  head: ({ loaderData: sr }) => ({
    meta: sr
      ? [
          { title: `${sr.meta_title ?? sr.h1 ?? "Setting Review"} — ForexEA360` },
          { name: "description", content: sr.meta_description ?? "" },
          { property: "og:title", content: sr.h1 ?? "Setting Review" },
          { property: "og:description", content: sr.meta_description ?? "" },
          { property: "og:type", content: "article" },
          ...(sr.thumbnail_url ? [{ property: "og:image", content: sr.thumbnail_url }] : []),
        ]
      : [],
  }),
  component: SettingReviewPage,
  notFoundComponent: () => (
    <div className="py-24 text-center">
      Setting review not found.{" "}
      <Link to="/setting-reviews" className="text-primary">Back to Setting Reviews</Link>
    </div>
  ),
});

// ─── Markdown renderer ────────────────────────────────────────────────────────

function MD({ md, className }: { md: string; className?: string }) {
  if (!md?.trim()) return null;
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h3 className="text-xl font-bold text-foreground mt-8 mb-3">{children}</h3>,
          h3: ({ children }) => <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h4>,
          h4: ({ children }) => <h5 className="text-base font-semibold text-foreground mt-4 mb-1">{children}</h5>,
          p: ({ children }) => <p className="text-base leading-7 text-foreground/90">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="text-base text-foreground/90 leading-7">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">{children}</a>
          ),
          img: ({ src, alt }) => (
            <figure className="my-4">
              <img src={src} alt={alt ?? ""} className="w-full rounded-xl border object-cover max-h-[480px]" />
              {alt && <figcaption className="mt-1.5 text-center text-xs text-muted-foreground">{alt}</figcaption>}
            </figure>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b last:border-0 hover:bg-muted/20">{children}</tr>,
          th: ({ children }) => <th className="text-left px-3 py-2 border-b bg-muted/30 font-medium">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-muted-foreground">{children}</td>,
          code: ({ children }) => <code className="rounded bg-muted/40 px-1 py-0.5 text-xs font-mono">{children}</code>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground">{children}</blockquote>
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FaqList({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!faqs.length) return null;
  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
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
            <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed border-t pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Set Files ────────────────────────────────────────────────────────────────

function SetFiles({ files }: { files: Array<{ name: string; body_md?: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!files.length) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-foreground mb-4">Set Files</h3>
      {files.map((f, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 font-semibold text-sm flex justify-between items-center hover:bg-muted/30"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              {f.name}
            </span>
            <span className="text-muted-foreground">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && f.body_md && (
            <div className="px-5 pb-5 border-t pt-4">
              <MD md={f.body_md} className="space-y-3" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Load steps ───────────────────────────────────────────────────────────────

function LoadSteps({ steps }: { steps: Array<{ platform: string; steps: string }> }) {
  if (!steps.length) return null;
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-foreground">How to Load the Set File</h3>
      {steps.map((s, i) => (
        <div key={i}>
          <p className="font-semibold text-sm text-primary mb-3">{s.platform}</p>
          <MD md={s.steps} className="space-y-3" />
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function SettingReviewPage() {
  const sr = Route.useLoaderData() as SetReview;
  const ct = sr.content ?? {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/setting-reviews" className="hover:text-primary flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Setting Reviews
        </Link>
        {sr.product_slug && (
          <>
            <span>/</span>
            <Link
              to="/product/$slug"
              params={{ slug: sr.product_slug }}
              search={{}}
              className="hover:text-primary"
            >
              Product page
            </Link>
          </>
        )}
      </div>

      {/* Hero image */}
      {sr.thumbnail_url && (
        <div className="mb-8 overflow-hidden rounded-2xl border">
          <img src={sr.thumbnail_url} alt={sr.h1 ?? ""} className="w-full object-cover max-h-[400px]" />
        </div>
      )}

      <h1 className="text-4xl font-bold leading-tight mb-4">{sr.h1}</h1>

      {sr.focus_keyword && (
        <span className="inline-block rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 mb-6">
          {sr.focus_keyword}
        </span>
      )}

      {/* Content sections */}
      <div className="space-y-12 mt-8">

        {ct.seo_introduction && (
          <section>
            <MD md={ct.seo_introduction} className="space-y-4" />
          </section>
        )}

        {!!ct.set_files?.length && (
          <section>
            <SetFiles files={ct.set_files} />
          </section>
        )}

        {ct.customization_guidance && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Customization Guidance</h2>
            <MD md={ct.customization_guidance} className="space-y-4" />
          </section>
        )}

        {ct.customization_cautions && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Cautions</h2>
            <MD md={ct.customization_cautions} className="space-y-4" />
          </section>
        )}

        {ct.config_strengths_limitations && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Strengths &amp; Limitations</h2>
            <MD md={ct.config_strengths_limitations} className="space-y-4" />
          </section>
        )}

        {ct.who_should_use && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Who Should Use This</h2>
            {typeof ct.who_should_use === "string"
              ? <MD md={ct.who_should_use} className="space-y-4" />
              : <ul className="list-disc list-outside ml-5 space-y-2">{(ct.who_should_use as string[]).map((s, i) => <li key={i} className="text-base text-foreground/90">{s}</li>)}</ul>
            }
          </section>
        )}

        {!!ct.load_set_steps?.length && (
          <section>
            <LoadSteps steps={ct.load_set_steps} />
          </section>
        )}

        {ct.final_verdict && (
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Final Verdict</h2>
            <MD md={ct.final_verdict} className="space-y-4" />
          </section>
        )}

        {!!ct.faqs?.length && <FaqList faqs={ct.faqs} />}

        {ct.risk_disclaimer && (
          <p className="text-xs text-muted-foreground border-t pt-4">
            {ct.risk_disclaimer}
          </p>
        )}

      </div>

      {/* CTA back to product */}
      {sr.product_slug && (
        <div className="mt-16 rounded-2xl border bg-card p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">Ready to get the EA?</p>
            <p className="text-sm text-muted-foreground mt-1">View full details, pricing and purchase options.</p>
          </div>
          <Link
            to="/product/$slug"
            params={{ slug: sr.product_slug }}
            search={{}}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 whitespace-nowrap"
          >
            View Product <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      )}

    </div>
  );
}
