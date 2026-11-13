import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { siteConfig } from "@/app.config";
import { getWhatsAppHref } from "@/lib/get-whatsapp-href";
import { resolveContactInitialPlanId } from "@/lib/resolve-contact-plan-id";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string; plan?: string; section?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const loc = locale as "it" | "en";
  return {
    title: t("contactsTitle"),
    description: t("contactsDescription"),
    alternates: buildAlternates("/contatti", loc),
    openGraph: { url: buildAlternates("/contatti", loc).canonical as string },
  };
}

export default async function ContattiPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { topic, plan, section } = await searchParams;
  const initialPlanId = await resolveContactInitialPlanId(locale, topic, plan);
  const t = await getTranslations("contactsPage");
  const tc = await getTranslations("Contact");
  const whatsappHref = getWhatsAppHref(locale);

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-5 sm:px-6">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-[var(--light-text-muted)]">{t("intro")}</p>
          <ul className="mt-8 space-y-4 text-sm text-[var(--light-text)]">
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--light-surface)] text-[var(--light-primary)]">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="font-medium text-[var(--light-text)] transition-colors hover:text-[var(--light-primary)]"
              >
                {siteConfig.links.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
              </span>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--light-text)] transition-colors hover:text-emerald-700"
              >
                {siteConfig.links.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--light-surface)] text-[var(--light-primary)]">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--light-text-muted)]">
                  {t("addressLabel")}
                </p>
                <p className="mt-0.5 font-medium text-[var(--light-text)]">
                  {siteConfig.address.full}
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-8 rounded-xl border border-[var(--light-border)] bg-white p-6">
            <h3 className="mb-4 font-semibold text-[var(--light-text)]">
              {tc("hours.title")}
            </h3>
            <div className="space-y-2 text-sm">
              {[
                {
                  day: tc("hours.monThu"),
                  time: tc("hours.monThuTime"),
                  closed: false,
                },
                {
                  day: tc("hours.fri"),
                  time: tc("hours.friTime"),
                  closed: false,
                },
                {
                  day: tc("hours.sat"),
                  time: tc("hours.satTime"),
                  closed: true,
                },
                {
                  day: tc("hours.sun"),
                  time: tc("hours.sunTime"),
                  closed: true,
                },
              ].map(({ day, time, closed }) => (
                <div key={day} className="flex justify-between gap-4">
                  <span className="text-[var(--light-text-muted)]">{day}</span>
                  <span
                    className={
                      closed
                        ? "text-[var(--light-text-muted)]"
                        : "font-medium text-[var(--light-text)]"
                    }
                  >
                    {time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--light-text-muted)]">{tc("hours.note")}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--light-border)] bg-white p-6 sm:p-8 lg:col-span-3">
          <h2 className="text-lg font-semibold text-[var(--light-emphasis)]">
            {t("formTitle")}
          </h2>
          <p className="mt-1 text-sm text-[var(--light-text-muted)]">{t("formHint")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--light-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-xs text-emerald-700">
                ✓
              </span>
              {t("socialProof.guarantee")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-xs text-emerald-700">
                ✓
              </span>
              {t("socialProof.freeQuote")}
            </span>
            <a
              href="https://wa.me/447754812247"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-700 transition-colors hover:text-emerald-800"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
              +44 7754 812247
            </a>
          </div>
          <div className="mt-6">
            <Suspense fallback={null}>
              <ContactForm
                defaultTopic={topic ?? ""}
                defaultPlan={plan ?? ""}
                initialPlanId={initialPlanId}
                defaultSection={section ?? ""}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
