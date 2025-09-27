import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			// Proxy requests from your frontend's /api path
			"/api": {
				// to your Laravel backend URL
				target: "http://127.0.0.1:8000",
				changeOrigin: true, // Required for virtual-hosted sites
			},
			"/sanctum/csrf-cookie": {
				target: "http://127.0.0.1:8000",
				changeOrigin: true,
			},
		},
	},
});
