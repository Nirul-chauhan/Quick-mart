import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            "/auth": {
                target: "http://localhost:9000",
                changeOrigin: true,
            },
            "/roles": {
                target: "http://localhost:9000",
                changeOrigin: true,
            },
        },
    },
});