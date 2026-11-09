"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Go straight to the dashboard.
  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const message = await login(email, password);
    setSubmitting(false);
    if (message) return setError(message);
    router.replace("/admin");
  }

  const input =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
        <div className="hazard-stripe h-2" />

        <div className="p-8">
          <div className="flex items-center justify-center gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand font-heading text-base font-bold text-ink">
              JNB
            </span>
            <span className="font-heading text-2xl font-bold tracking-wide text-ink">TOOLS</span>
          </div>
          <h1 className="mt-5 text-center font-heading text-xl font-bold uppercase tracking-wide text-ink">
            Admin Login
          </h1>
          <p className="mt-1 text-center text-sm text-muted">Sign in to manage your shop.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className={input}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={`${input} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-70"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {submitting ? "Signing in…" : "Log in"}
            </button>
          </form>

          {/* DEV ONLY: delete this box before going live */}
          <p className="mt-6 rounded-lg bg-brand-light px-3 py-2 text-center text-xs text-ink">
            Demo: admin@jnbtools.co.ke / jnb12345
          </p>
        </div>
      </div>
    </main>
  );
}