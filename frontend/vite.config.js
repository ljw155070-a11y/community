import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/app/", // ★ 이게 핵심. assets 경로가 /app/assets 로 나감
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  //리엑트에서 개인 개발할때 메인페이지 ssr 이므로 csr 과 연동로직
  //npm run dev 하면 페이지가 바로 로딩됨
  server: {
    open: "http://localhost:9999/mainpage",
    proxy: {
      "/mainpage": {
        target: "http://localhost:9999",
        changeOrigin: true,
      },
    },
  },
});
