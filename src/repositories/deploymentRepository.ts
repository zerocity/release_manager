import { ServiceDeployment, ServiceState } from '../types/deployment.types';

export interface IDeploymentRepository {
  getCurrentServices(): Promise<ServiceState[]>;
  getServiceVersion(serviceName: string): Promise<number | null>;
  updateServiceVersion(serviceName: string, version: number): Promise<void>;
  addDeployment(deployment: ServiceDeployment): Promise<void>;
  getAllDeployments(): Promise<ServiceDeployment[]>;
}

export class InMemoryDeploymentRepository implements IDeploymentRepository {
  private currentServices = new Map<string, number>();
  private deploymentHistory: ServiceDeployment[] = [];

  async getCurrentServices(): Promise<ServiceState[]> {
    return Array.from(this.currentServices.entries()).map(([serviceName, version]) => ({
      serviceName,
      version,
    }));
  }

  async getServiceVersion(serviceName: string): Promise<number | null> {
    return this.currentServices.get(serviceName) || null;
  }

  async updateServiceVersion(serviceName: string, version: number): Promise<void> {
    this.currentServices.set(serviceName, version);
  }

  async addDeployment(deployment: ServiceDeployment): Promise<void> {
    this.deploymentHistory.push(deployment);
  }

  async getAllDeployments(): Promise<ServiceDeployment[]> {
    return this.deploymentHistory;
  }

  // Test helper methods
  reset(): void {
    this.currentServices.clear();
    this.deploymentHistory = [];
  }

  getServicesCount(): number {
    return this.currentServices.size;
  }
}
