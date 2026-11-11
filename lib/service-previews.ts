export const SERVICE_PREVIEW_IDS = [
  "web",
  "restyle",
  "ecommerce",
  "app",
  "webapp",
  "seo",
] as const;

export type ServicePreviewId = (typeof SERVICE_PREVIEW_IDS)[number];

export type ServicePreview = {
  src: string;
  framed: boolean;
};

function isServicePreviewId(id: string): id is ServicePreviewId {
  return (SERVICE_PREVIEW_IDS as readonly string[]).includes(id);
}

export function servicePreview(id: string): ServicePreview {
  const key: ServicePreviewId = isServicePreviewId(id) ? id : "restyle";

  switch (key) {
    case "web":
      return { src: "/services/web.webp", framed: false };
    case "app":
      return { src: "/services/app.webp", framed: false };
    case "restyle":
      return { src: "/portfolio/hotel-boutique.webp", framed: true };
    case "ecommerce":
      return { src: "/portfolio/ecommerce-demo.webp", framed: true };
    case "webapp":
      return { src: "/portfolio/studio-legale-uk-demo.webp", framed: true };
    case "seo":
      return { src: "/portfolio/manutenzione-uk.webp", framed: true };
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}
