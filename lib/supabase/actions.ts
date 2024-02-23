"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { l } from "../utils";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

import { ActionResponse } from "@/lib/types/custom.type";

export const login = async (data: {
  email: string;
  password: string;
}): Promise<ActionResponse> => {
  const res = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  l(`------------------------> login`);
  l(`data: `, data);
  l(`result: `, res);
  l(`<------------------------ login`);

  if (res.error)
    return { status: "error", message: `An error occured: ${res.error}` };

  return {
    status: "success",
    message: `Welome again to Senoirs Sphere, ${res.data.user.user_metadata.name}!!`,
  };
};

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  secretKey: string;
}): Promise<ActionResponse> => {
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

  l(`------------------------> sign up`);
  l(`data: `, data);
  l(`result: `, res);
  l(`<------------------------ sign up`);

  if (res.error)
    return { status: "error", message: `An error occured: ${res.error}` };

  return {
    status: "success",
    message: `Welome to Senoirs Sphere, ${res.data.user?.user_metadata.name}!!`,
  };
};

export const checkGuest = async (id: string): Promise<boolean> => {
  const roleRes = await supabase
    .from("profile")
    .select("role")
    .eq("id", id)
    .single();

  return roleRes.data?.role === "guest";
};

export const deleteUser = async (id: string): Promise<ActionResponse> => {
  const isGuest = await checkGuest(id);
  if (isGuest)
    return {
      status: "warning",
      message: "This action is not allowed for guest users.",
    };

  const res = await supabase.from("profile").delete().eq("id", id);

  l(`------------------------> delete a user`);
  l(`id: `, id);
  l(`result: `, res);
  l(`<------------------------ delete a user`);

  if (res.error)
    return { status: "error", message: `An error occured: ${res.error}` };

  return {
    status: "success",
    message: "Your profile has been deleted successfully.",
  };
};

export const updateUser = async (
  id: string,
  data: {
    email?: string;
    password?: string;
    data?: {
      name?: string;
      avatar_url?: string;
      secret_key?: string;
      requested_role?: string;
    };
  },
): Promise<ActionResponse> => {
  const isGuest = await checkGuest(id);
  if (isGuest)
    return {
      status: "warning",
      message: "This action is not allowed for guest users.",
    };

  const res = await supabase.auth.updateUser(data);

  l(`------------------------> update a user`);
  l(`data: `, data);
  l(`result: `, res.data.user);
  l(`<------------------------ update a user`);

  if (res.error)
    return { status: "error", message: `An error occured: ${res.error}` };

  // show good messages when changing privileges
  const requested_role = data.data?.requested_role;
  if (requested_role !== undefined) {
    const roleData = await supabase
      .from("profile")
      .select("role")
      .eq("id", id)
      .single();
    const role = roleData.data?.role;

    console.log(`requested_role: `, requested_role);
    console.log(`role: `, role);

    if (requested_role !== role) {
      return {
        status: "info",
        message: "Your claim has been declined due to the wrong secret key.",
      };
    }
  }
  // show good messages when changing privileges

  return {
    status: "success",
    message: "Your profile has been updated successfully.",
  };
};

export const refresh = () => {
  revalidatePath("/", "layout");
  redirect("/");
};
