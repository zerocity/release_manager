import { cleanEnv, port, str } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  // Server configuration
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
    desc: 'Node environment',
  }),
  PORT: port({
    default: 3000,
    desc: 'Port number for the server',
  }),
  // Security
  API_KEY: str({
    desc: 'API key for authentication',
  }),
});

export type Env = typeof env;
