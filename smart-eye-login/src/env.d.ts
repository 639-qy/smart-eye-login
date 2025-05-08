/// <reference types="vite/client" />
# .env
VITE_API_BASE_URL=http://your-api-server.com/api
interface ImportMeta {
  readonly env: {
    readonly BASE_URL: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
    [key: string]: any;
  }
} 