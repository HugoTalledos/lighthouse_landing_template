/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_API_KEY: string;
  readonly PUBLIC_PLATFORM_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
