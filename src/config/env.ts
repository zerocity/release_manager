import { cleanEnv, port, str } from 'envalid';

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
});

export type Env = typeof env;
