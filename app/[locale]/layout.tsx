import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SchemaOrg } from "@/components/schema-org";
import { MainWrapper } from "@/components/main-wrapper";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { siteConfig } from "@/app.config";
import { routing } from "@/i18n/routing";
import "../globals.css";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: "%s | QC Tech",
    },
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Quantum Code Technologies Ltd", url: siteConfig.url }],
    creator: "Quantum Code Technologies Ltd",
    publisher: "Quantum Code Technologies Ltd",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_GB",
      alternateLocale: locale === "it" ? "en_GB" : "it_IT",
      siteName: "QC Tech",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${siteConfig.url}/logo-full.svg`,
          width: 1200,
          height: 630,
          alt: "Quantum Code Technologies Ltd — QC Tech",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${siteConfig.url}/logo-full.svg`],
    },
    verification: {
      google: "qkkUA1oP7CJy4tFCJIoq4MZHzHYxqcg9rdR9SXpwqp8",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "it" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#08050f] text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <SchemaOrg locale={locale} />
          <GoogleAnalytics />
          <SiteHeader />
          <MainWrapper>{children}</MainWrapper>
          <SiteFooter />
          <ScrollToTop />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
