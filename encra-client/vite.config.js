import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import VitePluginWasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
  },
});
