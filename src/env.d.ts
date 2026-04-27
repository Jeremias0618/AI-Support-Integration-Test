/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Base del API (p. ej. `/api` con proxy en dev, o URL absoluta en prod). */
  readonly PUBLIC_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
