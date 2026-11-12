"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CHIP_FAQ_IDS, getAssistantKb, type KbEntry } from "@/lib/assistant-kb";
import { getWhatsAppHref } from "@/lib/get-whatsapp-href";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Link } from "@/i18n/routing";

type ChatLine =
  | { kind: "intro" }
  | { kind: "user"; text: string }
  | { kind: "faq"; entry: KbEntry }
  | { kind: "fallback" }
  | { kind: "too_long" };

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AssistantChat({ open, onClose }: Props) {
  const locale = useLocale();
  const t = useTranslations("assistant");
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<ChatLine[]>([{ kind: "intro" }]);
  const kb = getAssistantKb(locale);
  const chips = CHIP_FAQ_IDS.map(
    (id) => kb.find((item) => item.id === id) ?? null,
  ).filter((item): item is KbEntry => item !== null);

  useEffect(() => {
    if (!open) {
      window.dispatchEvent(new CustomEvent("quantis:idle"));
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [lines, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function ask(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    setLines((prev) => [...prev, { kind: "user", text: message }]);
    if (message.length > 300) {
      setLines((prev) => [...prev, { kind: "too_long" }]);
      return;
    }
    setBusy(true);
    window.dispatchEvent(new CustomEvent("quantis:thinking"));
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, message }),
      });
      const data: unknown = await response.json();
      const type =
        data && typeof data === "object" && "type" in data
          ? String((data as { type: unknown }).type)
          : "";
      switch (type) {
        case "faq": {
          const id =
            data && typeof data === "object" && "id" in data
              ? String((data as { id: unknown }).id)
              : "";
          const entry = kb.find((item) => item.id === id);
          setLines((prev) => [
            ...prev,
            entry ? { kind: "faq", entry } : { kind: "fallback" },
          ]);
          break;
        }
        case "too_long":
          setLines((prev) => [...prev, { kind: "too_long" }]);
          break;
        case "fallback":
          setLines((prev) => [...prev, { kind: "fallback" }]);
          break;
        default:
          setLines((prev) => [...prev, { kind: "fallback" }]);
      }
    } catch {
      setLines((prev) => [...prev, { kind: "fallback" }]);
    } finally {
      setBusy(false);
      window.dispatchEvent(new CustomEvent("quantis:open-ui"));
    }
  }

  if (!open) return null;

  return (
    <div className="assistant-layer">
      <button
        type="button"
        className="assistant-backdrop"
        aria-label={t("close")}
        onClick={onClose}
      />
      <section
        className="assistant-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="assistant-panel-head">
          <h2 id={titleId} className="assistant-panel-title">
            {t("title")}
          </h2>
          <button
            type="button"
            className="assistant-panel-close"
            onClick={onClose}
            aria-label={t("close")}
          >
            ×
          </button>
        </header>
        <div ref={listRef} className="assistant-panel-body">
          {lines.map((line, index) => (
            <ChatBubble key={index} line={line} onClose={onClose} />
          ))}
          {busy ? (
            <p className="assistant-bubble assistant-bubble-bot" aria-live="polite">
              …
            </p>
          ) : null}
        </div>
        <div className="assistant-chips" aria-label={t("chipsLabel")}>
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="assistant-chip"
              onClick={() => void ask(chip.question)}
            >
              {chip.question}
            </button>
          ))}
        </div>
        <form
          className="assistant-form"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(draft);
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={320}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
          />
          <button type="submit" disabled={busy || draft.trim().length === 0}>
            {t("send")}
          </button>
        </form>
        <p className="assistant-panel-foot">
          {t("foot")}{" "}
          <Link href="/privacy">{t("privacy")}</Link>
        </p>
      </section>
    </div>
  );
}

function QuoteCta({ onClose }: { onClose: () => void }) {
  const t = useTranslations("assistant");
  return (
    <Link href="/contatti" className="assistant-quote-btn" onClick={onClose}>
      {t("quote")}
    </Link>
  );
}

function ChatBubble({
  line,
  onClose,
}: {
  line: ChatLine;
  onClose: () => void;
}) {
  const t = useTranslations("assistant");
  const locale = useLocale();

  switch (line.kind) {
    case "intro":
      return (
        <div className="assistant-bubble assistant-bubble-bot">
          <p>{t("intro")}</p>
          <p className="assistant-privacy">
            <Link href="/privacy">{t("privacy")}</Link>
          </p>
        </div>
      );
    case "user":
      return <p className="assistant-bubble assistant-bubble-user">{line.text}</p>;
    case "faq":
      return (
        <div className="assistant-bubble assistant-bubble-bot">
          <p className="assistant-faq-q">{line.entry.question}</p>
          <p>{line.entry.answer}</p>
          <div className="assistant-fallback-actions">
            <QuoteCta onClose={onClose} />
          </div>
        </div>
      );
    case "fallback":
      return (
        <div className="assistant-bubble assistant-bubble-bot">
          <p>{t("fallback")}</p>
          <div className="assistant-fallback-actions">
            <QuoteCta onClose={onClose} />
            <a
              href={getWhatsAppHref(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="assistant-fallback-btn"
            >
              <WhatsAppIcon decorative className="h-4 w-4 shrink-0" />
              {t("whatsapp")}
            </a>
          </div>
        </div>
      );
    case "too_long":
      return (
        <p className="assistant-bubble assistant-bubble-bot">{t("tooLong")}</p>
      );
    default: {
      const _exhaustive: never = line;
      return _exhaustive;
    }
  }
}
