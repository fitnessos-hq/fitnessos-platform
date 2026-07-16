import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [{ data: coachProfile }, { data: membership }] = await Promise.all([
    supabase
      .from("coach_profiles")
      .select("business_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("team_memberships")
      .select("role")
      .eq("coach_profile_id", user.id)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  if (!coachProfile || !membership) {
    redirect("/onboarding");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              FitnessOS
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {coachProfile.business_name}
            </h1>
            <p className="mt-2 text-slate-400">
              Signed in as the {membership.role} owner.
            </p>
          </div>

          <SignOutButton />
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Foundation complete</h2>
          <p className="mt-2 text-slate-400">
            Authentication, coach identity, and role-based access are now ready
            for validation.
          </p>
        </div>
      </section>
    </main>
  );
}