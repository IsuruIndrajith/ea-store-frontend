# EA Store – Frontend Plan

An original "EA Store" storefront inspired by the reference layout (not a copy of its branding, text or images). Built frontend-only with sample products, ready to plug into your Laravel API later.

Note: this project runs on React + Vite (via TanStack Start). You can keep developing here, or export the code and point it at your Laravel backend.

## Pages
1. **Home (/)** – hero ("Trade Smarter With Expert Advisors"), MT4/MT5/24-7 badges, live-style performance card (growth %, market, platform), "Best EAs" product grid, categories strip, why-us features, FAQ, footer.
2. **Shop (/shop)** – product grid with filters (category, platform MT4/MT5, price), sort, search.
3. **Product (/product/$slug)** – image gallery, title, version, strike-through price + discount badge, Add to Cart, tabs: Description / Features / Backtest results / Reviews, related products.
4. **Category (/category/$slug)** – filtered grid.
5. **Cart (/cart)** – line items, quantity, totals, "Checkout" button (placeholder until Laravel).

## Design
Dark trading theme: near-black navy background, gold accent (fits XAUUSD/gold EAs), green for gains, sharp display font (e.g. Space Grotesk + DM Sans). Product cards with discount ribbon, hover lift.

## Technical details
- `src/lib/api.ts`: single API layer with `getProducts`, `getProduct(slug)`, `getCategories`. Currently returns mock data from `src/data/products.ts`; switch to `fetch(VITE_API_URL + "/api/products")` when Laravel is ready.
- Product type mirrors a Laravel JSON resource: `id, slug, name, version, platform, categories[], price, sale_price, images[], description, features[], rating`.
- Data loaded via route loaders + TanStack Query; cart state in a React context persisted to localStorage.
- Suggested Laravel endpoints: `GET /api/products`, `GET /api/products/{slug}`, `GET /api/categories`, `POST /api/cart/checkout`, Sanctum for auth.
- Each route gets its own title/description meta. Product images generated as original placeholder artwork.
