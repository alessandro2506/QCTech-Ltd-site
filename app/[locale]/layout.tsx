import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SchemaOrg } from "@/components/schema-org";
import { MainWrapper } from "@/components/main-wrapper";
import { routing } from "@/i18n/routing";
import "../globals.css";

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
  const getLocalizedPath = (basePath: "/" | "/servizi" | "/vision" | "/contatti", targetLocale: "it" | "en") => {
    if (targetLocale === "it") {
      return basePath === "/" ? "/it" : `/it${basePath}`;
    }

    switch (basePath) {
      case "/servizi":
        return "/en/services";
      case "/vision":
        return "/en/about";
      case "/contatti":
        return "/en/contacts";
      default:
        return "/en";
    }
  };

  const localePath = getLocalizedPath("/", locale as "it" | "en");

  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: {
      default: t("title"),
      template: "%s | QC Tech",
    },
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Quantum Code Technologies Ltd", url: "https://www.qc-tech.co.uk" }],
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
      url: `https://www.qc-tech.co.uk${localePath}`,
      siteName: "QC Tech",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "QC Tech — The UK–Italy Digital Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://www.qc-tech.co.uk${localePath}`,
      languages: {
        it: `https://www.qc-tech.co.uk${getLocalizedPath("/", "it")}`,
        en: `https://www.qc-tech.co.uk${getLocalizedPath("/", "en")}`,
        "x-default": `https://www.qc-tech.co.uk${getLocalizedPath("/", "en")}`,
      },
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
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9T00M6BEF3"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9T00M6BEF3');
          `}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <SchemaOrg locale={locale} />
          <SiteHeader />
          <MainWrapper>{children}</MainWrapper>
          <SiteFooter />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
