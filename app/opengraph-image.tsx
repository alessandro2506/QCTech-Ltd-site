import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "QC Tech — The UK–Italy Digital Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1A3A5C 0%, #0d1f33 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            color: "#B8924A",
            fontSize: 28,
            marginBottom: 16,
            letterSpacing: 4,
          }}
        >
          QC TECH
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 52,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          The UK–Italy Digital Studio
        </div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 26,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Websites · E-commerce · Mobile Apps
        </div>
        <div
          style={{
            color: "#B8924A",
            fontSize: 20,
            marginTop: 40,
            borderTop: "1px solid #B8924A",
            paddingTop: 20,
            width: "100%",
            textAlign: "center",
          }}
        >
          qc-tech.co.uk
        </div>
      </div>
    ),
    { ...size },
  );
}
