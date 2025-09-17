import { Router } from 'express';
import { DeploymentController } from '../controllers/deployment.controller';
import { DeploymentService } from '../services/deployment.service';
import { InMemoryDeploymentRepository, InMemorySystemVersionRepository } from '../repositories';

const router = Router();

// TODO replace this with proper Dependency injection
const deploymentRepository = new InMemoryDeploymentRepository();
const systemVersionRepository = new InMemorySystemVersionRepository();
const deploymentService = new DeploymentService(deploymentRepository, systemVersionRepository);
const deploymentController = new DeploymentController(deploymentService, systemVersionRepository);

// Routes
router.post('/deploy', (req, res) => deploymentController.deploy(req, res));
router.get('/services', (req, res) => deploymentController.getServices(req, res));

export { router as deploymentRoutes };
