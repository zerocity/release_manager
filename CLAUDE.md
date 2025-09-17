# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based REST API service called "release-manager" with Express.js, featuring:
- Zod validation for request/response validation
- Service deployment tracking and system versioning
- User management endpoints with CRUD operations
- In-memory repository pattern (no database currently configured)

## Commands

### Development
```bash
npm run dev         # Start development server with hot reload (ts-node-dev)
npm run build       # Compile TypeScript to JavaScript in ./build
npm start           # Run production server from compiled code
npm test            # Run Jest tests
npm run lint        # Run ESLint on all TypeScript files
npm run lint:fix    # Run ESLint and auto-fix issues
npm run format      # Format code with Prettier
npm run format:check # Check code formatting without changing files
npm run typecheck   # Run TypeScript type checking without building
```

### Mise Tasks (Alternative)
```bash
mise run dev        # Start development server
mise run build      # Build the service
mise run start      # Start in production mode
mise run test       # Run tests
```

## Architecture

### Directory Structure
- **src/app.ts**: Express application setup with middleware configuration
- **src/index.ts**: Server entry point with graceful shutdown handling
- **src/controllers/**: Request handlers implementing business logic
- **src/services/**: Business logic layer
- **src/repositories/**: Data access layer (currently in-memory storage)
- **src/routes/**: Express route definitions
- **src/middleware/**: Error handling and Zod validation middleware
- **src/types/**: TypeScript types and Zod schemas for validation
- **src/config/**: Environment variable validation with envalid

### Key Patterns

1. **Validation**: 
   - User inputs validated using Zod schemas in `src/types/user.types.ts`
   - Deployment inputs validated using Zod schemas in `src/types/deployment.types.ts`
   - Environment variables validated using envalid in `src/config/env.ts`
2. **Error Handling**: Centralized error middleware with Zod error formatting
3. **Repository Pattern**: Abstract data access through repository layer for easy database integration

### API Endpoints

#### Health & User Management
- `GET /health` - Health check endpoint
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Deployment Management
- `POST /api/deploy` - Register service deployment
  - Body: `{name: string, version: number}`
  - Returns: `{systemVersion: number}`
  - Tracks service version changes and increments system version when changes occur
- `GET /api/services?systemVersion=<number>` - Query services at specific system version
  - Returns: `[{name: string, version: number}]`
  - Returns 404 if system version doesn't exist

### Environment Variables
Environment variables are validated using envalid with type checking and defaults in `src/config/env.ts`:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment: development/production/test (default: development)

All environment variables are type-safe and validated on startup. Invalid values will cause the application to fail with clear error messages.

### Docker Setup
Docker is required for running Jaeger. Install Docker on Linux:

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**Arch Linux/Manjaro:**
```bash
sudo pacman -S docker docker-compose
sudo systemctl start docker && sudo systemctl enable docker
```

**Post-install:** Add user to docker group: `sudo usermod -aG docker $USER`

### Version Control
The project includes a comprehensive `.gitignore` file that excludes:
- Build outputs (`build/`, `dist/`)
- Dependencies (`node_modules/`)
- Environment files (`.env*`)
- IDE files and caches
- Logs and temporary files

### Code Quality
The project uses ESLint and Prettier for code quality:
- **ESLint**: Configured with TypeScript rules and type checking (eslint.config.mts)
- **Prettier**: Enforces consistent code formatting (.prettierrc.json)
- **eslint-config-prettier**: Disables ESLint rules that conflict with Prettier
- Run `npm run lint` before committing to catch issues
- Run `npm run format` to auto-format code
- TypeScript strict mode is enabled for better type safety

### VS Code Integration
The project includes VS Code configuration for optimal development:
- **Tasks**: Use Ctrl+Shift+P → "Tasks: Run Task" to access:
  - `ESLint: Check All Files` - Run linting and capture errors in Problems panel
  - `ESLint: Fix All Files` - Auto-fix ESLint issues
  - `Prettier: Format All Files` - Format all files with Prettier
  - `TypeScript: Check Types` - Run TypeScript type checking (default build task)
  - `Build Project` - Compile TypeScript
- **Auto-formatting**: Files are automatically formatted on save
- **ESLint integration**: Inline linting with auto-fix on save
- **Recommended extensions**: ESLint and Prettier VS Code extensions