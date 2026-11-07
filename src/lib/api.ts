import { queryOptions } from "@tanstack/react-query";
import { categories, products, type Product, type Category } from "@/data/products";

// When the Laravel API is ready, set VITE_API_URL and swap the mock bodies for:
//   fetch(`${API_URL}/api/products`).then((r) => r.json()).then((j) => j.data)
export const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 50));

export async function getProducts(): Promise<Product[]> {
  return delay(products);
}
export async function getProduct(slug: string): Promise<Product | null> {
  return delay(products.find((p) => p.slug === slug) ?? null);
}
export async function getCategories(): Promise<Category[]> {
  return delay(categories);
}

export const productsQuery = () => queryOptions({ queryKey: ["products"], queryFn: getProducts });
export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["products", slug], queryFn: () => getProduct(slug) });
export const categoriesQuery = () => queryOptions({ queryKey: ["categories"], queryFn: getCategories });

export const discount = (p: Product) => Math.round((1 - p.sale_price / p.price) * 100);
export const money = (n: number) => `$${n.toFixed(2)}`;
