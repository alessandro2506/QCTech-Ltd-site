import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: t("contactsTitle"),
    description: t("contactsDescription"),
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
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-slate-400">{t("intro")}</p>
          <ul className="mt-8 space-y-4 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="font-medium text-slate-300 hover:text-violet-400 transition-colors"
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
                className="font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                {siteConfig.links.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t("addressLabel")}
                </p>
                <p className="mt-0.5 font-medium text-slate-300">
                  {siteConfig.address.full}
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-8 rounded-xl border border-violet-500/15 bg-white/3 p-6 backdrop-blur-sm">
            <h3 className="mb-4 font-semibold text-slate-200">
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
                  <span className="text-slate-500">{day}</span>
                  <span
                    className={
                      closed
                        ? "text-slate-600"
                        : "font-medium text-slate-300"
                    }
                  >
                    {time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-600">{tc("hours.note")}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 sm:p-8 lg:col-span-3">
          <h2 className="text-lg font-semibold text-slate-100">
            {t("formTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{t("formHint")}</p>
          <div className="mt-6">
            <ContactForm
              defaultTopic={topic ?? ""}
              defaultPlan={plan ?? ""}
              initialPlanId={initialPlanId}
              defaultSection={section ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
