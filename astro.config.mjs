// @ts-check
import { defineConfig } from 'astro/config';

/** Nest en LAN: destino del proxy `/api` solo en `astro dev`. Cambia aquí si cambia la IP/puerto. */
const BACKEND_DEV_PROXY_TARGET = 'http://10.80.80.219:2099';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/api': {
          target: BACKEND_DEV_PROXY_TARGET.replace(/\/+$/, ''),
          changeOrigin: true,
          rewrite: (path) => {
            const stripped = path.replace(/^\/api/, '');
            return stripped === '' ? '/' : stripped;
          },
        },
      },
    },
  },
});
