"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AssistantChat = dynamic(
  () => import("@/components/assistant-chat").then((mod) => mod.AssistantChat),
  { ssr: false },
);

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

  if (!loaded) return null;
  return <AssistantChat open={open} onClose={() => setOpen(false)} />;
}
