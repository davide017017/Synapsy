type Env = {
  APP_ENV: string;
  API_BASE_URL: string;
  TOKEN_HEADER: string;
};

export const getEnv = (): Env => {
  const { APP_ENV = 'development', API_BASE_URL, TOKEN_HEADER = 'Authorization' } =
    process.env as Record<string, string>;
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL non configurato');
  }
  return { APP_ENV, API_BASE_URL, TOKEN_HEADER };
};
