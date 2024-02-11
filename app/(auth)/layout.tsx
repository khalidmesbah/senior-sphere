import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";

const space_Grotesk = Space_Grotesk({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SeniorSphere",
  description: "Let's study",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={space_Grotesk.className}>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
