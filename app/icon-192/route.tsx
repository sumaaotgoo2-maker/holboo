import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f3d2e",
          color: "#ffffff",
          fontSize: 120,
          fontWeight: 700,
        }}
      >
        H
      </div>
    ),
    { width: 192, height: 192 }
  );
}
