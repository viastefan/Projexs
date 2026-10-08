import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#082078" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <path d="M19 19 45 45" stroke="#ffffff" strokeWidth="7" strokeLinecap="square" />
          <path d="M45 19 19 45" stroke="#0097b2" strokeWidth="7" strokeLinecap="square" />
        </svg>
      </div>
    ),
    size,
  );
}
