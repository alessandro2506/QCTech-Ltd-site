"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  readAssistantDraft,
  shouldKeepAssistantOpen,
} from "@/lib/assistant-storage";

const AssistantChat = dynamic(
  () => import("@/components/assistant-chat").then((mod) => mod.AssistantChat),
  { ssr: false },
);

function isDesktop(): boolean {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function AssistantHost() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setLoaded(true);
      setOpen((current) => !current);
    };
    window.addEventListener("quantis:open", onOpen);
    return () => window.removeEventListener("quantis:open", onOpen);
  }, []);

  useEffect(() => {
    if (!isDesktop()) return;
    if (!shouldKeepAssistantOpen() && !readAssistantDraft()) return;
    const path = window.location.pathname;
    if (!path.includes("/contatti") && !path.includes("/contacts")) return;
    setLoaded(true);
    setOpen(true);
  }, []);

  if (!loaded) return null;
  return <AssistantChat open={open} onClose={() => setOpen(false)} />;
}
