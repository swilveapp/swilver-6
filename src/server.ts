import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import path from 'path';
import { config } from './config';
import { errorHandler } from './middleware/error';
import { notFoundHandler } from './middleware/notFound';
import { setupRoutes } from './routes';
import { db } from './db';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../dist/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup routes
setupRoutes(app);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`API Documentation available at http://localhost:${config.port}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  try {
    const client = (db as any)._client;
    await client.end();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

export default app;