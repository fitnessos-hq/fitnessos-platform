import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TeamAccessPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  const { data: memberships, error } = await supabase
    .from("team_memberships")
    .select("id, coach_profile_id, user_id, role, is_active, created_at")
    .order("id", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold tracking-[0.3em] text-emerald-400">
          FITNESSOS
        </p>

        <h1 className="mt-3 text-3xl font-bold">Team access validation</h1>

        <p className="mt-2 text-slate-300">
          Current signed-in user: {user.id}
        </p>

        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Visible team memberships</h2>

          {error ? (
            <p className="mt-4 text-red-300">Query error: {error.message}</p>
          ) : memberships && memberships.length > 0 ? (
            <pre className="mt-4 overflow-x-auto rounded bg-slate-950 p-4 text-sm text-emerald-200">
              {JSON.stringify(memberships, null, 2)}
            </pre>
          ) : (
            <p className="mt-4 rounded bg-slate-950 p-4 text-slate-300">
              No memberships are visible to this user yet.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}