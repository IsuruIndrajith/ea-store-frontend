import { API_URL, apiRequest } from "@/lib/api";

export interface StoreUser {
  id: number;
  name: string;
  email: string;
}

export interface StoreLicense {
  id: number;
  key: string;
  status: string;
}

export interface StoreOrder {
  id: number;
  status: string;
  total: number;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    licenses: StoreLicense[];
  }>;
}

interface AuthResponse {
  data: StoreUser;
  token: string;
}

export const getToken = () =>
  typeof window === "undefined" ? null : window.sessionStorage.getItem("ea-store-token");

export async function login(email: string, password: string): Promise<StoreUser> {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  window.sessionStorage.setItem("ea-store-token", response.token);
  return response.data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<StoreUser> {
  const response = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
  });
  window.sessionStorage.setItem("ea-store-token", response.token);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiRequest("/auth/logout", { method: "POST" });
  window.sessionStorage.removeItem("ea-store-token");
}

export async function getCurrentUser(): Promise<StoreUser> {
  const response = await apiRequest<{ data: StoreUser }>("/me");
  return response.data;
}

export async function getOrders(): Promise<StoreOrder[]> {
  const response = await apiRequest<{ data: StoreOrder[] }>("/me/orders");
  return response.data;
}

export async function createCheckout(
  items: Array<{ slug: string; qty: number }>,
): Promise<{ checkout_url: string }> {
  const response = await apiRequest<{ data: { order_id: number; checkout_url: string } }>(
    "/checkout",
    {
      method: "POST",
      body: JSON.stringify({ items }),
    },
  );
  return response.data;
}

export async function downloadLicense(licenseId: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Sign in to download your product.");
  if (!API_URL) throw new Error("The backend API URL is not configured.");

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/api/me/licenses/${licenseId}/download`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok)
    throw new Error(
      response.status === 404
        ? "This download is not available."
        : "The download could not be started.",
    );

  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `ea-store-license-${licenseId}`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
