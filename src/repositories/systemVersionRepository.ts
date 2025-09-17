import { SystemVersion, ServiceState } from '../types/deployment.types';

export interface ISystemVersionRepository {
  getCurrentSystemVersion(): Promise<number>;
  createSystemVersion(services: ServiceState[]): Promise<number>;
  getSystemVersion(version: number): Promise<SystemVersion | null>;
  getAllSystemVersions(): Promise<SystemVersion[]>;
}

export class InMemorySystemVersionRepository implements ISystemVersionRepository {
  private systemVersions = new Map<number, SystemVersion>();
  private currentSystemVersion = 0;

  async getCurrentSystemVersion(): Promise<number> {
    return this.currentSystemVersion;
  }

  async createSystemVersion(services: ServiceState[]): Promise<number> {
    this.currentSystemVersion++;

    const systemVersion: SystemVersion = {
      systemVersion: this.currentSystemVersion,
      services: services.map((service) => ({
        serviceName: service.serviceName,
        version: service.version,
      })),
      createdAt: new Date(),
    };

    this.systemVersions.set(this.currentSystemVersion, systemVersion);
    return this.currentSystemVersion;
  }

  async getSystemVersion(version: number): Promise<SystemVersion | null> {
    return this.systemVersions.get(version) || null;
  }

  async getAllSystemVersions(): Promise<SystemVersion[]> {
    return Array.from(this.systemVersions.values());
  }

  // Test helper methods
  reset(): void {
    this.systemVersions.clear();
    this.currentSystemVersion = 0;
  }

  getVersionsCount(): number {
    return this.systemVersions.size;
  }
}
