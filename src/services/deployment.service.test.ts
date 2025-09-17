import { describe, it, expect, beforeEach } from 'vitest';
import { DeploymentService } from './deployment.service';
import { InMemoryDeploymentRepository } from '../repositories/deploymentRepository';
import { InMemorySystemVersionRepository } from '../repositories/systemVersionRepository';

describe('DeploymentService', () => {
  let deploymentService: DeploymentService;
  let deploymentRepo: InMemoryDeploymentRepository;
  let systemVersionRepo: InMemorySystemVersionRepository;

  beforeEach(() => {
    deploymentRepo = new InMemoryDeploymentRepository();
    systemVersionRepo = new InMemorySystemVersionRepository();
    deploymentService = new DeploymentService(deploymentRepo, systemVersionRepo);
  });

  describe('handleDeployment', () => {
    it('should deploy a new service and create system version', async () => {
      const result = await deploymentService.handleDeployment({ name: 'api', version: 1 });

      expect(result.systemVersion).toBe(1);

      const currentServices = await deploymentRepo.getCurrentServices();
      expect(currentServices).toMatchInlineSnapshot(`
        [
          {
            "serviceName": "api",
            "version": 1,
          },
        ]
      `);
    });

    it('should increment system version when service version changes', async () => {
      // First deployment
      await deploymentService.handleDeployment({ name: 'api', version: 1 });

      // Second deployment with different version
      const result = await deploymentService.handleDeployment({ name: 'api', version: 2 });

      expect(result.systemVersion).toBe(2);
      const currentServices = await deploymentRepo.getCurrentServices();
      expect(currentServices).toMatchInlineSnapshot(`
        [
          {
            "serviceName": "api",
            "version": 2,
          },
        ]
      `);
    });

    it('should not increment system version when same service version is deployed', async () => {
      // First deployment
      await deploymentService.handleDeployment({ name: 'api', version: 1 });

      // Second deployment with same version
      const result = await deploymentService.handleDeployment({ name: 'api', version: 1 });

      expect(result.systemVersion).toBe(1);
    });

    it('should handle multiple services correctly', async () => {
      await deploymentService.handleDeployment({ name: 'api', version: 1 });
      const result = await deploymentService.handleDeployment({ name: 'frontend', version: 1 });

      expect(result.systemVersion).toBe(2);

      const currentServices = await deploymentRepo.getCurrentServices();

      expect(currentServices).toMatchInlineSnapshot(`
        [
          {
            "serviceName": "api",
            "version": 1,
          },
          {
            "serviceName": "frontend",
            "version": 1,
          },
        ]
      `);
    });
  });
});
