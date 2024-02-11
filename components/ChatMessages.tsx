import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { createClient } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { cookies } from "next/headers";

export default async function ChatMessages() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("messages")
    .select("*,users(*)")
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });

  console.log(data, error, "from ChatMessages");

  return (
    <Suspense fallback={"loading.."}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}
