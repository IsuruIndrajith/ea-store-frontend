import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import { setReviewsQuery, type SetReview } from "@/lib/api";

export const Route = createFileRoute("/setting-reviews/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(setReviewsQuery()),
  head: () => ({
    meta: [
      { title: "Setting Reviews — ForexEA360" },
      {
        name: "description",
        content:
          "In-depth configuration guides and setting reviews for Forex Expert Advisors. Learn exactly how to set up and optimise every EA parameter.",
      },
    ],
  }),
  component: SettingReviewsPage,
});

function ReviewCard({ sr }: { sr: SetReview }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:border-primary/50 hover:shadow-md">
      {/* Thumbnail — clicks through to the setting review */}
      <Link to="/setting-reviews/$slug" params={{ slug: sr.slug }} search={{}}>
        {sr.thumbnail_url ? (
          <div className="overflow-hidden">
            <img
              src={sr.thumbnail_url}
              alt={sr.h1 ?? ""}
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-44 items-center justify-center bg-muted/30">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {sr.focus_keyword && (
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {sr.focus_keyword}
          </span>
        )}

        <Link to="/setting-reviews/$slug" params={{ slug: sr.slug }} search={{}}>
          <h2 className="flex-1 text-base font-bold leading-snug text-foreground hover:text-primary">
            {sr.h1}
          </h2>
        </Link>

        {sr.meta_description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {sr.meta_description}
          </p>
        )}

        {/* Bottom row — Read guide + View product */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link
            to="/setting-reviews/$slug"
            params={{ slug: sr.slug }}
            search={{}}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Read guide <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {sr.product_slug && (
            <Link
              to="/product/$slug"
              params={{ slug: sr.product_slug }}
              search={{}}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              View EA <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingReviewsPage() {
  const { data: reviews } = useSuspenseQuery(setReviewsQuery());

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Setting Reviews
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Detailed configuration guides for every EA we carry. Learn what each
          parameter does, which settings suit different market conditions, and
          how to get the most out of your EA.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
          No setting reviews published yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((sr) => (
            <ReviewCard key={sr.slug} sr={sr} />
          ))}
        </div>
      )}
    </div>
  );
}
