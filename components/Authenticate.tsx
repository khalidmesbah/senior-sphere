import { Metadata } from "next";

import UserAuthForm from "@/components/UserAuthForm";
import { FunctionSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="relative bg-muted h-screen max-h-screen">
      <div className="absolute inset-[0_0_0_50%] bg-zinc-900" />

      <div className="max-w-5xl mx-auto h-[inherit] items-center md:grid lg:grid-cols-2">
        <div className="hidden h-[inherit] flex-col p-10 text-white lg:flex dark:border-r">
          <div className="relative z-20 flex gap-2 items-center text-lg font-medium">
            <FunctionSquare />
            SeniorSphere Inc
          </div>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <blockquote className="text-lg">
                "StudySphere is a collaborative online platform crafted by
                senior students at the Faculty of Science, Mathematics
                Department, Sohag University. It represents our commitment to
                academic excellence and camaraderie, offering resources for
                studying, quizzes, note-taking, and collaborative discussions.
                As we embark on our final year together, StudySphere serves as
                both a tool for learning and a cherished memory of our shared
                academic journey."
              </blockquote>
              <footer className="text-sm indent-5 decoration-wavy underline">
                DEV: Khalid Mesbah
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="w-full h-[inherit] flex items-center justify-center">
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
