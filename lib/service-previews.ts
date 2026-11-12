export const SERVICE_PREVIEW_IDS = [
  "web",
  "restyle",
  "ecommerce",
  "app",
  "webapp",
  "seo",
  "maintenance",
] as const;

export type ServicePreviewId = (typeof SERVICE_PREVIEW_IDS)[number];

export type ServicePreview = {
  src: string;
};

function isServicePreviewId(id: string): id is ServicePreviewId {
  return (SERVICE_PREVIEW_IDS as readonly string[]).includes(id);
}

export function servicePreview(id: string): ServicePreview {
  const key: ServicePreviewId = isServicePreviewId(id) ? id : "web";

  switch (key) {
    case "web":
    case "restyle":
    case "ecommerce":
    case "app":
    case "webapp":
    case "seo":
    case "maintenance":
      return { src: `/services/${key}.webp` };
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}
