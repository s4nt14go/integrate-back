declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      APP_ID: string;
      PRV_KEY: string;
      APP_SECRET: string;
    }
  }
}
export {}
