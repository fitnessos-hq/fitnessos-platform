"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

type Feedback = {
  kind: "error" | "success";
  message: string;
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (isSignUp && fullName.length < 2) {
      setFeedback({
        kind: "error",
        message: "Please enter your full name.",
      });
      return;
    }

    if (password.length < 8) {
      setFeedback({
        kind: "error",
        message: "Password must contain at least 8 characters.",
      });
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      setIsSubmitting(false);

      if (error) {
        setFeedback({ kind: "error", message: error.message });
        return;
      }

      if (data.session) {
        router.replace("/onboarding");
        router.refresh();
        return;
      }

      setFeedback({
        kind: "success",
        message: "Check your email to confirm your account, then return here.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setFeedback({ kind: "error", message: error.message });
      return;
    }

    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          FitnessOS
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          {isSignUp ? "Create your coach account" : "Welcome back"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {isSignUp
            ? "Start with a secure account for your coaching business."
            : "Sign in to continue to your coaching workspace."}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {isSignUp ? (
            <label className="block text-sm font-medium">
              Full name
              <input
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 outline-none ring-emerald-400 focus:ring-2"
                name="fullName"
                required
                autoComplete="name"
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium">
            Email address
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 outline-none ring-emerald-400 focus:ring-2"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 outline-none ring-emerald-400 focus:ring-2"
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </label>

          {feedback ? (
            <p
              className={
                feedback.kind === "error"
                  ? "rounded-lg bg-red-950/70 p-3 text-sm text-red-300"
                  : "rounded-lg bg-emerald-950/70 p-3 text-sm text-emerald-300"
              }
              role="status"
            >
              {feedback.message}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Please wait..."
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? "Already have an account?" : "New to FitnessOS?"}{" "}
          <Link
            className="font-semibold text-emerald-400 hover:text-emerald-300"
            href={isSignUp ? "/sign-in" : "/sign-up"}
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}