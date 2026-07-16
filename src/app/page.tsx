import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
          FitnessOS
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">
          The operating system for coaching businesses.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-400">
          Secure coach accounts, team roles, and a foundation built for reliable
          client operations.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
            href="/sign-up"
          >
            Create coach account
          </Link>
          <Link
            className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500"
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}