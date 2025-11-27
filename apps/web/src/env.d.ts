/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // Agrega aquí otras variables de entorno VITE_ si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}