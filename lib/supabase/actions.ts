"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(data: { email: string; password: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const res = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  console.log(`------------------------> login`);
  console.log(`data: `, data);
  console.log(`result: `, res);
  console.log(`<------------------------ login`);

  return res;
}

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  secretKey: string;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const res = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        secret_key: data.secretKey,
      },
    },
  });

  console.log(`------------------------> sign up`);
  console.log(`data: `, data);
  console.log(`result: `, res);
  console.log(`<------------------------ sign up`);

  return res;
}

export const deleteUser = async (id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const res = await supabase.from("profile").delete().eq("id", id);

  console.log(`------------------------> delete a user`);
  console.log(`id: `, id);
  console.log(`result: `, res);
  console.log(`<------------------------ delete a user`);

  return res;
};

export const refresh = () => {
  revalidatePath("/", "layout");
  redirect("/");
};

export const updateUser = async (data: {
  email?: string;
  password?: string;
  data?: {
    name?: string;
    avatar_url?: string;
    secretKey?: string;
  };
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const res = await supabase.auth.updateUser({
    data,
  });

  console.log(`------------------------> update a user`);
  console.log(`data: `, data);
  console.log(`result: `, res);
  console.log(`<------------------------ update a user`);

  return res;
};
