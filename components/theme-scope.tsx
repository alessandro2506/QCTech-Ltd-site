"use client";

import dynamic from "next/dynamic";
import { usePathname } from "@/i18n/routing";
import { isLightPath } from "@/lib/is-light-path";

const QuantisFloat = dynamic(
  () =>
    import("@/components/quantis-float").then((mod) => mod.QuantisFloat),
  { ssr: false },
);

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
      {light ? <QuantisFloat /> : null}
    </div>
  );
}
