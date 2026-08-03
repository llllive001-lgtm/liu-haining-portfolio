import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || "/",
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  build: {
    rollupOptions: {
      output: mode === "single" ? { inlineDynamicImports: true } : {},
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
}));
