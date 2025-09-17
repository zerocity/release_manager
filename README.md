# Release Manager

A TypeScript-based REST API service for managing service deployments and system versioning.

## Features

- **Service Deployment Tracking**: Register and track service deployments with version control
- **System Versioning**: Automatically increments system version when service versions change
- **RESTful API**: Clean API endpoints for deployment and service management
- **Type Safety**: Full TypeScript implementation with Zod validation
- **In-Memory Storage**: Currently uses in-memory repositories (easily swappable for databases)

## Installation

```bash
mise install    # Install runtime and all additional tools
npm install     # Install all dependencies
```

## Development

### Primary Workflow (Mise)

```bash
mise tasks      # List all tasks with descriptions

mise dev        # Start development server with hot reload
mise test       # Run tests
mise lint       # Run linting
mise typecheck  # Type checking
mise format     # Format code
mise build      # Build the service
mise start      # Start in production mode
```

### Alternative npm commands

For environments without mise, you can use npm directly:

```bash
npm run dev       # Start development server with hot reload
npm test          # Run tests
npm run lint      # Run linting
npm run typecheck # Type checking
npm run format    # Format code
npm run build     # Build the service
npm start         # Start in production mode
```

## Building

```bash
mise build
mise start  # Run production server
```

## API Endpoints

### Health Check

- `GET /health` - Service health status (no authentication required)

### Deployment Management

All deployment endpoints require API key authentication. Include the API key in one of:
- Header: `X-API-Key: your-api-key`
- Query parameter: `?api_key=your-api-key`

- `POST /api/deploy` - Register a service deployment

  ```json
  {
    "name": "service-name",
    "version": 1
  }
  ```

  Returns:

  ```json
  {
    "systemVersion": 1
  }
  ```

- `GET /api/services?systemVersion=1` - Get services at a specific system version (requires API key)
  Returns:
  ```json
  [
    {
      "name": "service-name",
      "version": 1
    }
  ]
  ```

## Architecture

### Directory Structure

```
src/
├── app.ts                 # Express application setup
├── index.ts              # Server entry point
├── config/               # Configuration and environment validation
├── controllers/          # Request handlers
├── services/            # Business logic layer
├── repositories/        # Data access layer
├── routes/              # API route definitions
├── middleware/          # Express middleware
└── types/               # TypeScript types and Zod schemas
```

### Key Components

- **Validation**: Request/response validation using Zod schemas
- **Error Handling**: Centralized error middleware
- **Repository Pattern**: Abstract data access for easy database integration
- **Dependency Injection**: Clean separation of concerns

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment: development/production/test (default: development)
- `API_KEY` - API key for authentication (default: development-api-key)

## Testing

The project uses Jest for testing. Run tests with:

```bash
mise test
```

Or using npm:
```bash
npm test
```

## Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode enabled

## License

MIT
