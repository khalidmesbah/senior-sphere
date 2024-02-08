import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <>
      <h1>Settings</h1>

      <h2>Profile</h2>
      <p>Hello {data.user.email}</p>

      <h2>Appearance</h2>
      <ThemeSwitcher />
    </>
  );
}
