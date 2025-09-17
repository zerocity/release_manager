import { z, ZodType } from 'zod';

export interface DeploymentRequest {
  name: string;
  version: number;
}

// Zod schemas for input validation
export const DeploymentRequestSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  version: z.number().int().positive('Version must be a positive integer'),
}) satisfies ZodType<DeploymentRequest>;

interface SystemVersionQuery {
  systemVersion: number;
}

export const SystemVersionQuerySchema = z.object({
  systemVersion: z
    .string()
    .min(1, 'System version is required')
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0;
      },
      {
        message: 'System version must be a positive integer',
      }
    )
    .transform((val) => parseInt(val, 10)),
}) satisfies ZodType<SystemVersionQuery, z.ZodTypeDef, { systemVersion: string }>;

// TypeScript types for validated inputs

// TypeScript types for internal data structures
export type ServiceDeployment = {
  serviceName: string;
  version: number;
  deployedAt: Date;
};

export type SystemVersion = {
  systemVersion: number;
  services: Array<{
    serviceName: string;
    version: number;
  }>;
  createdAt: Date;
};

// Service state for tracking current deployments
export type ServiceState = {
  serviceName: string;
  version: number;
};

export type DeploymentResponse = {
  systemVersion: number;
};
