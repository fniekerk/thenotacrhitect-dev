import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d1117",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        {/* Top: wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "#e05a2b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "serif",
            }}
          >
            ✕
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#8b95b0",
              fontFamily: "sans-serif",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            The Not Architect
          </span>
        </div>

        {/* Middle: headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#f0f4ff",
              fontFamily: "sans-serif",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Business and technology
            <br />
            <span style={{ color: "#e05a2b" }}>in equal measure.</span>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#6b7899",
              fontFamily: "sans-serif",
              lineHeight: 1.5,
            }}
          >
            People · Process · Technology
          </div>
        </div>

        {/* Bottom: tagline */}
        <div
          style={{
            fontSize: 20,
            color: "#4a5270",
            fontFamily: "serif",
            fontStyle: "italic",
          }}
        >
          I draw boxes, cross them out, and ship.
        </div>
      </div>
    ),
    { ...size }
  );
}
