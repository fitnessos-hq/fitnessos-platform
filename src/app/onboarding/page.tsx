import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
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
      .select("id, business_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("team_memberships")
      .select("id")
      .eq("coach_profile_id", user.id)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  if (coachProfile && membership) {
    redirect("/dashboard");
  }

  return (
    <OnboardingForm initialBusinessName={coachProfile?.business_name ?? ""} />
  );
}