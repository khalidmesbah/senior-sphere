"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(data: { email: string; password: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(data: {
  name: string;
  email: string;
  password: string;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      data: {
        name: data.name,
        avatar_url:
          "https://gravatar.com/avatar/cabce76d9f0166e9515ff7bf52d16d58?s=400&d=robohash&r=x",
      },
    },
  });
  console.log(`------------------------`);
  console.log(`formData, `, JSON.stringify(data));
  console.log(`trying with data,`, data);
  console.log(`get the error, `, error);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
