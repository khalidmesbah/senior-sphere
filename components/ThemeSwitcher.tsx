"use client";

import { l } from "@/lib/utils";
import { Switch } from "@nextui-org/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    l(theme);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Switch
        size="lg"
        color="success"
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
        className="capitalize"
        isSelected={theme == "dark"}
        onChange={() => {
          setTheme(theme == "light" ? "dark" : "light");
        }}
      >
        Dark mode
      </Switch>
    </div>
  );
}
