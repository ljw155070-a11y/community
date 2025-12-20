import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/app/", // ★ 이게 핵심. assets 경로가 /app/assets 로 나감
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
