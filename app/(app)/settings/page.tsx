import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./ProfileForm";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chip, Button } from "@nextui-org/react";
import { UserIcon } from "lucide-react";
import { deleteUser } from "@/lib/supabase/actions";
import DeleteButton from "./DeleteButton";
import ChangePrivileges from "./ChangePrivileges";
import { l } from "@/lib/utils";

export default async function SettingsProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: roles, error: roles_error } = await supabase
    .from("profile")
    .select("id, role")
    .eq("id", data.user.id);

  if (roles_error || !roles || !roles[0].role) {
    redirect("/login");
  }
  const isGuest = data.user.email === process.env.NEXT_PUBLIC_GUEST_EMAIL;

  const role = roles[0].role as string;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-between items-center">
        <h3 className="text-lg font-medium">Profile</h3>
        <ChangePrivileges
          id={data.user.id}
          currentRole={role}
          isGuest={isGuest}
        />
      </div>
      <span>
        Your are currently signed in as
        {role.toLowerCase().startsWith("a") ? " an " : " a "}
      </span>
      <Chip color="primary" variant="faded" className="capitalize">
        {role}
      </Chip>
      <Separator />
      <ProfileForm user={data.user} />
      {isGuest ? null : (
        <>
          <Separator />
          <DeleteButton user_id={data.user.id} />
        </>
      )}
    </div>
  );
}
