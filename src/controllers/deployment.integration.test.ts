import { describe, it, expect, beforeEach } from 'vitest';
import { request, TEST_API_KEY } from '../test.setup';

describe('Deployment API Integration Tests', () => {
  beforeEach(async () => {
    // Clear any existing data between tests by calling a reset endpoint or internal reset
    // For now, tests should be isolated by running in sequence
  });

  describe('POST /api/deploy', () => {
    it('should require API key', async () => {
      const response = await request
        .post('/api/deploy')
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        error: 'API key is required',
      });
    });

    it('should reject invalid API key', async () => {
      const response = await request
        .post('/api/deploy')
        .set('X-API-Key', 'invalid-key')
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(403);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid API key',
      });
    });

    it('should deploy a new service and create system version', async () => {
      const response = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(200);

      expect(response.body).toEqual({
        systemVersion: expect.any(Number),
      });
      expect(response.body.systemVersion).toBeGreaterThan(0);
    });

    it('should increment system version when service version changes', async () => {
      // Deploy ServiceA v1
      const response1 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(200);

      const systemVersion1 = response1.body.systemVersion;

      // Deploy ServiceA v2 (should increment system version)
      const response2 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 2,
        })
        .expect(200);

      const systemVersion2 = response2.body.systemVersion;

      expect(systemVersion2).toBeGreaterThan(systemVersion1);
    });

    it('should not increment system version when same service version is deployed', async () => {
      // Deploy ServiceA v1
      const response1 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(200);

      const systemVersion1 = response1.body.systemVersion;

      // Deploy ServiceA v1 again (should not increment system version)
      const response2 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(200);

      const systemVersion2 = response2.body.systemVersion;

      expect(systemVersion2).toEqual(systemVersion1);
    });

    it('should handle multiple services correctly', async () => {
      // Deploy ServiceA v1
      const responseA1 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(200);

      // Deploy ServiceB v1 (should increment system version)
      const responseB1 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceB',
          version: 1,
        })
        .expect(200);

      // Deploy ServiceA v2 (should increment system version)
      const responseA2 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 2,
        })
        .expect(200);

      // Deploy ServiceB v1 again (should not increment system version)
      const responseB1Again = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceB',
          version: 1,
        })
        .expect(200);

      expect(responseB1.body.systemVersion).toBeGreaterThan(responseA1.body.systemVersion);
      expect(responseA2.body.systemVersion).toBeGreaterThan(responseB1.body.systemVersion);
      expect(responseB1Again.body.systemVersion).toEqual(responseA2.body.systemVersion);
    });

    it('should return validation error for missing name', async () => {
      const response = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          version: 1,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return validation error for missing version', async () => {
      const response = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return validation error for invalid version type', async () => {
      const response = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 'invalid',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return validation error for negative version', async () => {
      const response = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: -1,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/services', () => {
    it('should return services at specific system version', async () => {
      // Deploy ServiceA v1
      await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(200);

      // Deploy ServiceB v1
      const responseB = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceB',
          version: 1,
        })
        .expect(200);

      const systemVersionB = responseB.body.systemVersion;

      // Query services at version B
      const servicesResponse = await request
        .get(`/api/services?systemVersion=${systemVersionB}`)
        .set('X-API-Key', TEST_API_KEY)
        .expect(200);

      expect(Array.isArray(servicesResponse.body)).toBe(true);
      expect(servicesResponse.body).toContainEqual({
        name: 'ServiceA',
        version: 1,
      });
      expect(servicesResponse.body).toContainEqual({
        name: 'ServiceB',
        version: 1,
      });
    });

    it('should return updated services after version change', async () => {
      // Deploy ServiceA v1
      await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 1,
        })
        .expect(200);

      // Deploy ServiceB v1
      await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceB',
          version: 1,
        })
        .expect(200);

      // Update ServiceA to v2
      const responseA2 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceA',
          version: 2,
        })
        .expect(200);

      const systemVersionA2 = responseA2.body.systemVersion;

      // Query services at the latest version
      const servicesResponse = await request
        .get(`/api/services?systemVersion=${systemVersionA2}`)
        .set('X-API-Key', TEST_API_KEY)
        .expect(200);

      expect(Array.isArray(servicesResponse.body)).toBe(true);
      expect(servicesResponse.body).toContainEqual({
        name: 'ServiceA',
        version: 2,
      });
      expect(servicesResponse.body).toContainEqual({
        name: 'ServiceB',
        version: 1,
      });
    });

    it('should return 404 for non-existent system version', async () => {
      const response = await request
        .get('/api/services?systemVersion=999999')
        .set('X-API-Key', TEST_API_KEY)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should return validation error for invalid system version format', async () => {
      const response = await request
        .get('/api/services?systemVersion=invalid')
        .set('X-API-Key', TEST_API_KEY)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return validation error for missing system version', async () => {
      const response = await request
        .get('/api/services')
        .set('X-API-Key', TEST_API_KEY)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('End-to-end deployment workflow', () => {
    it('should handle complete deployment scenario matching HTTP tests', async () => {
      // Deploy Service X v1 (using unique names to avoid conflicts with previous tests)
      const deployX1 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceX',
          version: 1,
        })
        .expect(200);

      const versionX1 = deployX1.body.systemVersion;

      // Deploy Service Y v1
      const deployY1 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceY',
          version: 1,
        })
        .expect(200);

      const versionY1 = deployY1.body.systemVersion;
      expect(versionY1).toBeGreaterThan(versionX1);

      // Update Service X to v2
      const deployX2 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceX',
          version: 2,
        })
        .expect(200);

      const versionX2 = deployX2.body.systemVersion;
      expect(versionX2).toBeGreaterThan(versionY1);

      // Redeploy Service Y same version (no increment)
      const redeployY1 = await request
        .post('/api/deploy')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          name: 'ServiceY',
          version: 1,
        })
        .expect(200);

      expect(redeployY1.body.systemVersion).toEqual(versionX2);

      // Query services at version Y1
      const servicesAtY1 = await request
        .get(`/api/services?systemVersion=${versionY1}`)
        .set('X-API-Key', TEST_API_KEY)
        .expect(200);

      expect(servicesAtY1.body).toContainEqual({ name: 'ServiceX', version: 1 });
      expect(servicesAtY1.body).toContainEqual({ name: 'ServiceY', version: 1 });

      // Query services at version X2
      const servicesAtX2 = await request
        .get(`/api/services?systemVersion=${versionX2}`)
        .set('X-API-Key', TEST_API_KEY)
        .expect(200);

      expect(servicesAtX2.body).toContainEqual({ name: 'ServiceX', version: 2 });
      expect(servicesAtX2.body).toContainEqual({ name: 'ServiceY', version: 1 });
    });
  });
});
