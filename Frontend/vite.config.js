import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

const env = dotenv.config({
  path: `.env.${process.env.NODE_ENV}.local`,
}).parsed;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": JSON.stringify(env),
  },
});
