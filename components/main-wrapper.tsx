"use client";

import { usePathname } from "@/i18n/routing";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <main className={`flex-1${isHome ? "" : " pt-14 sm:pt-[3.75rem]"}`}>
      {children}
    </main>
  );
}
