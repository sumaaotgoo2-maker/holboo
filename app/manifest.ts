import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Холбоё",
    short_name: "Холбоё",
    description: "Ажил хайгч, ажил олгогч хоёрыг холбоно",
    start_url: "/",
    display: "standalone",
    background_color: "#0f3d2e",
    theme_color: "#0f3d2e",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
