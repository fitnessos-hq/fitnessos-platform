"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function OnboardingForm({
  initialBusinessName,
}: {
  initialBusinessName: string;
}) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const normalizedBusinessName = businessName.trim();

    if (normalizedBusinessName.length < 2) {
      setErrorMessage("Please enter a business name.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsSubmitting(false);
      setErrorMessage("Your session has expired. Please sign in again.");
      return;
    }

    const { error: coachProfileError } = await supabase
      .from("coach_profiles")
      .upsert(
        {
          id: user.id,
          business_name: normalizedBusinessName,
        },
        { onConflict: "id" },
      );

    if (coachProfileError) {
      setIsSubmitting(false);
      setErrorMessage(coachProfileError.message);
      return;
    }

    const { error: membershipError } = await supabase
      .from("team_memberships")
      .upsert(
        {
          coach_profile_id: user.id,
          user_id: user.id,
          role: "coach",
          is_active: true,
        },
        { onConflict: "coach_profile_id,user_id" },
      );

    setIsSubmitting(false);

    if (membershipError) {
      setErrorMessage(membershipError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          FitnessOS setup
        </p>
        <h1 className="mt-3 text-3xl font-bold">Set up your coaching business</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This creates your coach profile and your first owner membership.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            Business name
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 outline-none ring-emerald-400 focus:ring-2"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              required
              autoComplete="organization"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg bg-red-950/70 p-3 text-sm text-red-300" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating workspace..." : "Create coaching workspace"}
          </button>
        </form>
      </section>
    </main>
  );
}