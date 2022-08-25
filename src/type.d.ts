interface Window {
  dataLayer: Record<string, any>
  fm: any
}

declare module "esbuild-plagin-env" {
  export const API_KEY: string
}
