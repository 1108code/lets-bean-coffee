declare global {
  interface Window {
    __LET_BEAN_BASE_PATH__?: string;
  }
}

const basePath =
  typeof window !== "undefined" ? window.__LET_BEAN_BASE_PATH__ || "" : "";

export function assetPath(path: string) {
  if (!path || path.startsWith("data:") || path.startsWith("http")) return path;
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}

export {};
