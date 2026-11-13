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
  body_md?: string;
  values?: Record<string, unknown>[];
  groups?: string[];
  risk_params?: string[];
  differences?: string;
  limitations?: string;
}

export interface ProductImage {
  url: string;
  alt_text?: string;
  caption?: string;
  section?: string;
}

export interface ProductExtended {
  // AI-generated fields (primary source)
  description_md?: string;
  short_description?: string;
  // Legacy manually-filled fields (kept for backwards compat)
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
  images?: ProductImage[];
}

export interface DetailedParameterGroup {
  group: string;
  table: string;
}

export interface LoadSetStep {
  platform: string;
  steps: string;
}

export interface SetReviewData {
  // SEO fields (from generated content seo block)
  focus_keyword?: string;
  recommended_slug?: string;
  suggested_h1?: string;
  meta_description?: string;
  // Content sections — may be markdown strings (from AI) or legacy arrays
  seo_introduction?: string;
  specs_table?: string | Record<string, unknown>[];
  set_comparison_table?: string | Record<string, unknown>[];
  important_parameters?: Record<string, unknown>[];
  requirements_table?: string | Record<string, unknown>[];
  customization_guidance?: string | (string | Record<string, unknown>)[];
  customization_cautions?: string;
  config_strengths_limitations?: string;
  who_should_use?: string | string[];
  final_verdict?: string;
  product_page_cta?: string;
  review_methodology?: string;
  risk_disclaimer?: string;
  load_set_steps?: (string | LoadSetStep | Record<string, unknown>)[];
  detailed_parameter_analysis?: DetailedParameterGroup[];
  set_files?: SetFile[];
  faqs?: ProductFaq[];
  images?: ProductImage[];
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

