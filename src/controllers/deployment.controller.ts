import { Request, Response } from 'express';
import { DeploymentService } from '../services/deployment.service';
import { DeploymentRequestSchema, SystemVersionQuerySchema } from '../types/deployment.types';
import { ISystemVersionRepository } from '../repositories';

export class DeploymentController {
  constructor(
    private deploymentService: DeploymentService,
    private systemVersionRepository: ISystemVersionRepository
  ) {}

  async deploy(req: Request, res: Response) {
    const validationResult = DeploymentRequestSchema.parse(req.body);
    const result = await this.deploymentService.handleDeployment(validationResult);
    res.status(200).json(result);
  }

  async getServices(req: Request, res: Response) {
    const { systemVersion } = SystemVersionQuerySchema.parse(req.query);
    const systemVersionData = await this.systemVersionRepository.getSystemVersion(systemVersion);
    if (!systemVersionData) {
      return res.status(404).json({
        success: false,
        message: `System version ${systemVersion} not found`,
      });
    }
    const services = systemVersionData.services.map((service) => ({
      name: service.serviceName,
      version: service.version,
    }));
    res.status(200).json(services);
  }
}
