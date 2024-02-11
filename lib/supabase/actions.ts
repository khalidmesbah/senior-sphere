"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toast } from "sonner";

export async function login(data: { email: string; password: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { data: res, error } = await supabase.auth.signInWithPassword(data);
  console.log(`------------------------> login`);
  console.log(`trying with data,`, res);
  console.log(`get the error, `, error);
  console.log(`<------------------------ login`);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: {
  name: string;
  email: string;
  password: string;
  passphrase: string;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        passphrase: formData.passphrase,
      },
    },
  });

  console.log(`------------------------> sign up`);
  console.log(`trying with formData,`, formData);
  console.log(`get the data,`, data);
  console.log(`get the error, `, error);
  console.log(`<------------------------ sign up`);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export const deleteUser = async (user_id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", user_id);

  console.log(`------------------------> delete a user`);
  console.log(`trying with an id,`, user_id);
  console.log(`get the data,`, data);
  console.log(`get the error, `, error?.message);
  toast(error?.message);
  console.log(`<------------------------ delete a user`);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
};
