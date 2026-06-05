import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qc-tech.co.uk"),
};

/** Layout radice: html/body vivono in app/[locale]/layout.tsx (next-intl). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
