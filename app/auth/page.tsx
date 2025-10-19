'use client';

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseProvider";
import { useToast } from "@/components/ToastProvider";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const { notify } = useToast();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [router, session]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email || !password) {
        notify("Email and password are required.", "error");
        return;
      }

      setIsLoading(true);
      try {
        if (mode === "signin") {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            notify(error.message, "error");
            return;
          }
          notify("Welcome back.", "success");
        } else {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) {
            notify(error.message, "error");
            return;
          }
          notify("Check your inbox to confirm your account.", "info");
        }
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    },
    [email, mode, notify, password, router, supabase]
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-background px-8 py-16">
      <div className="w-full max-w-md border border-black/20 bg-white px-10 py-12 shadow-sm">
        <div className="text-center">
          <p className="font-serif text-3xl uppercase tracking-[0.4em]">Note Paper</p>
          <p className="mt-4 text-sm uppercase tracking-[0.35em] text-black/60">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </p>
        </div>
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <label className="block text-xs uppercase tracking-[0.3em] text-black/70">
            Email
            <input
              type="email"
              className="mt-2 w-full border border-black/20 bg-white px-3 py-2 font-sans text-base focus:border-black/40 focus:outline-none"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.3em] text-black/70">
            Password
            <input
              type="password"
              className="mt-2 w-full border border-black/20 bg-white px-3 py-2 font-sans text-base focus:border-black/40 focus:outline-none"
              placeholder="••••••••"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full border border-black bg-black px-4 py-2 font-serif text-lg uppercase tracking-[0.4em] text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-black/70">
          {mode === "signin" ? (
            <p>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="border-b border-black/30 text-black hover:border-black"
              >
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="border-b border-black/30 text-black hover:border-black"
              >
                Sign in
              </button>
            </p>
          )}
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-black/50">
            <Link href="/">Return to Home</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
