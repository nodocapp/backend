declare global {
    namespace NodeJS {
        interface ProcessEnv {
            AUTH_AUDIENCE: string;
            AUTH_ISSUER: string;
            DB_URI: string;
            DOCS_PATH: string
        }
    }
}

export {};