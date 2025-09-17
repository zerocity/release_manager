import { IDeploymentRepository, ISystemVersionRepository } from '../repositories';
import {
  ServiceDeployment,
  DeploymentRequest,
  DeploymentResponse,
} from '../types/deployment.types';

export class DeploymentService {
  constructor(
    private deploymentRepository: IDeploymentRepository,
    private systemVersionRepository: ISystemVersionRepository
  ) {}

  async handleDeployment(request: DeploymentRequest): Promise<DeploymentResponse> {
    // Check if this is a version change
    const hasVersionChanged = await this.hasServiceVersionChanged(request.name, request.version);

    // Update the service version in our tracking
    await this.updateServiceDeployment(request);

    // Get current system version or create new one if version changed
    let systemVersion: number;
    if (hasVersionChanged) {
      systemVersion = await this.createNewSystemVersion();
    } else {
      systemVersion = await this.systemVersionRepository.getCurrentSystemVersion();
    }

    return { systemVersion };
  }

  private async hasServiceVersionChanged(
    serviceName: string,
    newVersion: number
  ): Promise<boolean> {
    const currentVersion = await this.deploymentRepository.getServiceVersion(serviceName);
    const hasChanged = currentVersion !== newVersion;
    return hasChanged;
  }

  private async updateServiceDeployment(request: DeploymentRequest): Promise<void> {
    // Update current service version
    await this.deploymentRepository.updateServiceVersion(request.name, request.version);

    // Add to deployment history
    const deployment: ServiceDeployment = {
      serviceName: request.name,
      version: request.version,
      deployedAt: new Date(),
    };

    await this.deploymentRepository.addDeployment(deployment);
  }

  private async createNewSystemVersion(): Promise<number> {
    // Get all currently deployed services
    const currentServices = await this.deploymentRepository.getCurrentServices();

    // Create new system version with snapshot of all services
    const systemVersion = await this.systemVersionRepository.createSystemVersion(currentServices);

    return systemVersion;
  }
}
