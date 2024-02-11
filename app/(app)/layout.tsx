import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { Providers } from "../providers";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const space_Grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SeniorSphere",
  description: "Let's study and make memories",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();
  console.log(data, error, "from RootLayout");

  // if (!error || data.user) {
  //   redirect("/login");
  // }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={space_Grotesk.className}>
        <Providers>
          <Navbar user={data.user} />
          <div className="relative max-w-5xl mx-auto h-fit min-h-[calc(100vh_-_65px)] py-4 px-2">
            {children}
          </div>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
