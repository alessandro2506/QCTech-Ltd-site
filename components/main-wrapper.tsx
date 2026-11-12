"use client";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  return <main className="flex-1 pt-[60px] lg:pt-[98px]">{children}</main>;
}
