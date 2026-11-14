import { queryOptions } from "@tanstack/react-query";
import {
  type Product,
  type Category,
  type ProductExtended,
  type ProductImage,
  type SetReviewData,
  type SetFile,
  type ProductFaq,
  type DetailedParameterGroup,
  type LoadSetStep,
} from "@/data/products";

export type { Product, Category, ProductExtended, ProductImage, SetReviewData, SetFile, ProductFaq, DetailedParameterGroup, LoadSetStep };

// import.meta.env is only available in the client bundle (Vite replaces it at build time).
// On the SSR server, fall back to process.env so server-side loaders can reach the backend.
export const API_URL = (import.meta.env["VITE_API_URL"] ??
  (typeof process !== "undefined" ? process.env["VITE_API_URL"] : undefined)) as
  | string
  | undefined;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new Error("The backend API URL is not configured.");

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const token = typeof window !== "undefined" ? sessionStorage.getItem("ea-store-token") : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL.replace(/\/$/, "")}/api${path}`, {
    ...init,
    headers,
  });
  const responseText = await response.text();
  let body: unknown = null;
  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch (error) {
      if (response.ok) throw new Error("The backend returned an invalid response.");
      console.error("Could not parse an API error response.", error);
    }
  }
  if (!response.ok) {
    const data = body as { message?: string; errors?: Record<string, string[]> } | null;
    const message =
      data?.message ??
      Object.values(data?.errors ?? {})[0]?.[0] ??
      `Request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiRequest<{ data: Product[] }>("/products");
  return response.data;
}
export async function getProduct(slug: string, previewToken?: string): Promise<Product | null> {
  const qs = previewToken ? `?preview_token=${encodeURIComponent(previewToken)}` : "";
  try {
    const response = await apiRequest<{ data: Product }>(`/products/${encodeURIComponent(slug)}${qs}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiRequest<{ data: Category[] }>("/categories");
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return [];
  }
}

export const productsQuery = () => queryOptions({ queryKey: ["products"], queryFn: getProducts });
export const productQuery = (slug: string, previewToken?: string) =>
  queryOptions({ queryKey: ["products", slug, previewToken], queryFn: () => getProduct(slug, previewToken) });
export const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: getCategories });

export const discount = (p: Product) => Math.round((1 - p.sale_price / p.price) * 100);
export const money = (n: number) => `$${n.toFixed(2)}`;
