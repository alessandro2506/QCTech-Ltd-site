"use client";

import { usePathname } from "@/i18n/routing";
import { isLightPath } from "@/lib/is-light-path";

export function ThemeScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const light = isLightPath(pathname);

  return (
    <div
      className={
        light
          ? "theme-light flex min-h-full flex-1 flex-col bg-[var(--light-bg)] text-[var(--light-text)]"
          : "flex min-h-full flex-1 flex-col"
      }
    >
      {children}
    </div>
  );
}
