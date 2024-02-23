"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { l } from "../utils";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

const createQuiz = async (quiz: any) => {
  // add type
  const res = await supabase
    .from("quiz")
    .insert([...quiz])
    .select();

  l(`------------------------> createQuiz`);
  l(`quiz: `, quiz);
  l(`result: `, res);
  l(`<------------------------ createQuiz`);

  if (res.error)
    return { status: "error", message: `An error occured: ${res.error}` };

  return {
    status: "success",
    message: `Welome to Senoirs Sphere, ${res.data}!!`,
  };
};

export { createQuiz };
