export type Platform = "MT4" | "MT5" | "MT4 & MT5";

export interface Category {
  slug: string;
  name: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface SetFile {
  name: string;
  purpose?: string;
  values?: Record<string, unknown>[];
  groups?: string[];
  risk_params?: string[];
  differences?: string;
  limitations?: string;
}

export interface ProductExtended {
  intro?: string;
  first_hand_test_results?: string;
  key_features?: (string | { title?: string; text?: string })[];
  why_buy_this?: (string | { title?: string; text?: string })[];
  honest_limitation?: string;
  why_different?: string;
  strategy_logic?: (string | { title?: string; text?: string })[];
  risk_controls?: (string | { title?: string; text?: string })[];
  risk_disclaimer_line?: string;
  optimized_settings_table?: Record<string, unknown>[];
  install_steps?: (string | { step?: string; text?: string })[];
  is_it_worth_it?: string;
  telegram_support_line?: string;
  reviewed_by_closer?: string;
  author_info?: string;
  reviewed_by_author_name?: string;
  reviewed_by_author_profile_link?: string;
  faqs?: ProductFaq[];
}

export interface SetReviewData {
  focus_keyword?: string;
  seo_introduction?: string;
  specs_table?: Record<string, unknown>[];
  set_comparison_table?: Record<string, unknown>[];
  important_parameters?: Record<string, unknown>[];
  requirements_table?: Record<string, unknown>[];
  load_set_steps?: (string | Record<string, unknown>)[];
  customization_guidance?: (string | Record<string, unknown>)[];
  who_should_use?: string[];
  final_verdict?: string;
  risk_disclaimer?: string;
  set_files?: SetFile[];
  faqs?: ProductFaq[];
}

// Mirrors a Laravel JSON resource for a product.
export interface Product {
  id: number;
  slug: string;
  name: string;
  version: string;
  platform: Platform;
  market: string;
  categories: string[];
  price: number;
  sale_price: number;
  growth: number;
  drawdown: number;
  rating: number;
  reviews: number;
  hue: number;
  description: string;
  meta_title?: string;
  meta_description?: string;
  features: string[];
  vendor_url?: string;
  myfxbook_link?: string;
  extended?: ProductExtended;
  set_review_data?: SetReviewData;
  is_purchasable?: boolean;
}

export const categories: Category[] = [
  { slug: "forex-ea", name: "Forex EA" },
  { slug: "gold-ea", name: "Gold EA" },
  { slug: "low-drawdown", name: "Low Drawdown" },
  { slug: "indicators", name: "Indicators" },
  { slug: "source-code", name: "Source Code" },
];

const base = (p: Omit<Product, "description" | "features">): Product => ({
  ...p,
  description: `${p.name} is an automated Expert Advisor for ${p.platform} trading ${p.market}. It combines trend filters, adaptive lot sizing and strict risk controls to keep drawdown low while capturing strong moves.`,
  features: [
    "Fully automated — plug and play",
    "Includes optimized set files",
    "Hard stop loss on every trade",
    "Works with any broker, low spread recommended",
    "Free lifetime updates",
  ],
});

export const products: Product[] = [
  base({
    id: 1,
    slug: "gold-titan-mt5",
    name: "Gold Titan EA",
    version: "v5.2",
    platform: "MT5",
    market: "XAUUSD",
    categories: ["gold-ea", "forex-ea", "low-drawdown"],
    price: 849,
    sale_price: 49.99,
    growth: 298,
    drawdown: 8.4,
    rating: 4.8,
    reviews: 124,
    hue: 80,
  }),
  base({
    id: 2,
    slug: "night-owl-scalper",
    name: "Night Owl Scalper",
    version: "v4.1",
    platform: "MT4 & MT5",
    market: "EURUSD",
    categories: ["forex-ea", "low-drawdown"],
    price: 299,
    sale_price: 49.99,
    growth: 186,
    drawdown: 5.1,
    rating: 4.6,
    reviews: 88,
    hue: 250,
  }),
  base({
    id: 3,
    slug: "aurum-ai-mt5",
    name: "Aurum AI",
    version: "v6.0",
    platform: "MT5",
    market: "XAUUSD",
    categories: ["gold-ea", "forex-ea"],
    price: 999,
    sale_price: 59.99,
    growth: 412,
    drawdown: 12.2,
    rating: 4.9,
    reviews: 203,
    hue: 60,
  }),
  base({
    id: 4,
    slug: "trend-pulse-indicator",
    name: "Trend Pulse Indicator",
    version: "v2.3",
    platform: "MT4 & MT5",
    market: "All pairs",
    categories: ["indicators"],
    price: 149,
    sale_price: 19.99,
    growth: 0,
    drawdown: 0,
    rating: 4.5,
    reviews: 51,
    hue: 160,
  }),
  base({
    id: 5,
    slug: "steady-grid-pro",
    name: "Steady Grid Pro",
    version: "v3.8",
    platform: "MT4",
    market: "GBPUSD",
    categories: ["forex-ea", "source-code"],
    price: 399,
    sale_price: 39.99,
    growth: 154,
    drawdown: 9.7,
    rating: 4.4,
    reviews: 67,
    hue: 20,
  }),
  base({
    id: 6,
    slug: "falcon-breakout",
    name: "Falcon Breakout EA",
    version: "v1.9",
    platform: "MT5",
    market: "US30",
    categories: ["forex-ea", "low-drawdown"],
    price: 499,
    sale_price: 44.99,
    growth: 221,
    drawdown: 6.3,
    rating: 4.7,
    reviews: 95,
    hue: 200,
  }),
  base({
    id: 7,
    slug: "golden-hedge-source",
    name: "Golden Hedge + Source",
    version: "v2.0",
    platform: "MT4 & MT5",
    market: "XAUUSD",
    categories: ["gold-ea", "source-code"],
    price: 1299,
    sale_price: 89.99,
    growth: 340,
    drawdown: 14.5,
    rating: 4.6,
    reviews: 42,
    hue: 40,
  }),
  base({
    id: 8,
    slug: "volatility-lens",
    name: "Volatility Lens",
    version: "v1.4",
    platform: "MT5",
    market: "All pairs",
    categories: ["indicators"],
    price: 99,
    sale_price: 14.99,
    growth: 0,
    drawdown: 0,
    rating: 4.3,
    reviews: 30,
    hue: 300,
  }),
];
