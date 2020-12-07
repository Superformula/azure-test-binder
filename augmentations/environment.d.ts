declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'local' | 'ci'
      AZURE_PERSONAL_ACCESS_TOKEN: string
      ORG_URL: string
      PROJECT: string
    }
  }
}

export {}
