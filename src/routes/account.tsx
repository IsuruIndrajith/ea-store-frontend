import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { ApiError, money } from "@/lib/api";
import {
  downloadLicense,
  getCurrentUser,
  getOrders,
  getToken,
  login,
  logout,
  register,
  type StoreOrder,
  type StoreUser,
} from "@/lib/account";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — ForexEA360" },
      {
        name: "description",
        content: "Manage your ForexEA360 account, orders, and product licenses.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [user, setUser] = useState<StoreUser | null>(null);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const { clear: clearCart } = useCart();

  const refreshOrders = async () => setOrders(await getOrders());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") === "success") {
        clearCart();
        toast.success("Payment successful! Your order has been placed.");
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("checkout");
        cleanUrl.searchParams.delete("session_id");
        window.history.replaceState({}, "", cleanUrl.toString());
      }
    }
  }, [clearCart]);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    let active = true;
    void Promise.all([getCurrentUser(), getOrders()])
      .then(([currentUser, currentOrders]) => {
        if (active) {
          setUser(currentUser);
          setOrders(currentOrders);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          if (error instanceof ApiError && error.status === 401)
            window.sessionStorage.removeItem("ea-store-token");
          else toast.error(error instanceof Error ? error.message : "Could not load your account.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const signedIn =
        mode === "register"
          ? await register(
              String(form.get("name")),
              String(form.get("email")),
              String(form.get("password")),
              String(form.get("password_confirmation")),
            )
          : await login(String(form.get("email")), String(form.get("password")));
      setUser(signedIn);
      await refreshOrders();
      toast.success(mode === "register" ? "Account created." : "Signed in.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
      setOrders([]);
      toast.success("Signed out.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-out failed.");
    }
  };

  const handleDownload = async (licenseId: number) => {
    try {
      await downloadLicense(licenseId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download failed.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-muted-foreground">
        Loading your account…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {user ? (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Account</p>
              <h1 className="mt-1 text-4xl font-bold">{user.name}</h1>
              <p className="mt-2 text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="rounded-lg border px-4 py-2 text-sm hover:border-primary"
            >
              Sign out
            </button>
          </div>
          <h2 className="mt-10 text-2xl font-bold">Orders & licenses</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-muted-foreground">
              No orders yet.{" "}
              <a href="/shop" className="text-primary">
                Browse the store.
              </a>
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <section key={order.id} className="rounded-2xl border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">Order #{order.id}</p>
                    <span className="rounded-full border px-3 py-1 text-xs capitalize">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} · {money(order.total)}
                  </p>
                  <div className="mt-4 divide-y">
                    {order.items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="py-3">
                        <p className="font-medium">
                          {item.name}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                        </p>
                        {item.licenses.map((license) => (
                          <div
                            key={license.id}
                            className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm"
                          >
                            <code className="rounded bg-muted px-2 py-1">{license.key}</code>
                            <button
                              onClick={() => handleDownload(license.id)}
                              className="text-primary hover:underline"
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">EA Store</p>
          <h1 className="mt-1 text-3xl font-bold">
            {mode === "register" ? "Create your account" : "Sign in"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An account is required to complete a purchase and access your licenses.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <label className="block text-sm font-medium">
                Name
                <input
                  name="name"
                  required
                  maxLength={255}
                  autoComplete="name"
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
            )}
            <label className="block text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
              />
            </label>
            {mode === "register" && (
              <label className="block text-sm font-medium">
                Confirm password
                <input
                  name="password_confirmation"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
                />
              </label>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-gold px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "register" ? "login" : "register")}
            className="mt-4 w-full text-sm text-primary hover:underline"
          >
            {mode === "register"
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </div>
      )}
    </div>
  );
}
