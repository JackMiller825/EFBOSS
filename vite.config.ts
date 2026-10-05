import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4721,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4721,
    strictPort: true,
  },
});
