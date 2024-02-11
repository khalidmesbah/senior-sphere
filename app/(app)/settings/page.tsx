import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chip, Button } from "@nextui-org/react";
import { UserIcon } from "lucide-react";
import { deleteUser } from "@/lib/supabase/actions";
import DeleteButton from "./DeleteButton";

export default async function SettingsProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: user_roles, error: user_roles_error } = await supabase
    .from("user_roles")
    .select("roles(role_name), user_id")
    .eq("user_id", data.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <div className="flex gap-2 flex-wrap items-center justify-center">
          <span>Your are currently signed in as a</span>
          <Chip color="primary" variant="faded" className="capitalize">
            {(user_roles?.[0] && user_roles[0].roles?.role_name) || "viewer"}
          </Chip>
        </div>
        <div></div>
        {/* <pre className="text-sm text-muted-foreground max-w-sm"> */}
        {/*   <br /> */}
        {/*   <code className="max-w-sm break-all"> */}
        {/*     user_roles: {JSON.stringify(user_roles)} */}
        {/*   </code> */}
        {/*   <br /> */}
        {/*   <code className="max-w-sm"> */}
        {/*     user_roles_error: {JSON.stringify(user_roles_error)} */}
        {/*   </code> */}
        {/*   <br /> */}
        {/*   <code className="max-w-sm"> data_user: {JSON.stringify(data)}</code> */}
        {/*   <br /> */}
        {/*   <code className="max-w-sm"> */}
        {/*     data_user_error: {JSON.stringify(error)} */}
        {/*   </code> */}
        {/* </pre> */}
      </div>
      <Separator />
      <ProfileForm user={data.user} />
      <Separator />
      <DeleteButton user_id={data.user.id} />
    </div>
  );
}
