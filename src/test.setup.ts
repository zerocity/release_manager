import { beforeAll, afterEach, afterAll } from 'vitest';
import supertest, { Test } from 'supertest';
import { Server } from 'http';
import { app } from './app';
import TestAgent from 'supertest/lib/agent';

let server: Server;
let request: TestAgent<Test>;

beforeAll(async () => {
  // Start server on random port for testing
  server = app.listen(0);
  request = supertest(app);
});

afterEach(async () => {
  // Clean up any test data if needed
});

afterAll(async () => {
  // Close server
  server?.close();
});

export { request };
