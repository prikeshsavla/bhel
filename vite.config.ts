import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: [
        "safari-pinned-tab.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "assets/music/mixkit-rising-forest-471.mp3",
        "favicon-32x32.png",
        "favicon-16x16.png",
        "https://unpkg.com/@picocss/pico@latest/css/pico.min.css ",
      ],
      manifest: {
        name: "Bhel",
        short_name: "Bhel",
        id: "Bhel",
        description: "Your Light Exercise Timer 💪",
        theme_color: "#11191f",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: ["assets/music/mixkit-rising-forest-471.mp3"],
    },
  },
});
