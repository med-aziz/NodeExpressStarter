import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import v1ApiRouter from './v1/presenters/routes/api';
import getV1AuthRouter from './v1/presenters/routes/auth';
import { handleErrorMiddleware } from './v1/presenters/middlewares/errors/handleError.middleware';
import { requestInterceptor } from './v1/presenters/middlewares/interceptors/request.interceptor';
import { responseInterceptor } from './v1/presenters/middlewares/interceptors/response.interceptor';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsDoc from 'swagger-jsdoc';
import * as path from 'path';
import { DOCS_API_BASE_URL, STATIC_FILES_PATH } from './config';
import { logger } from './v1/core/logger/logger';

const server = express();
const allowedOrigins = ['https://www.dev.tresovista.laxmi.cloud', 'http://localhost:3000'];
server.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
server.use(express.json());
server.use(cookieParser());
server.use(requestInterceptor);
server.use(responseInterceptor);
server.use(express.static(STATIC_FILES_PATH));
server.use('/v1/api', v1ApiRouter);
server.use('/v1/auth', getV1AuthRouter());

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'TrésoVista Api',
    description: 'TrésoVista Api Docs',
    version: '2.0.0',
  },
  servers: [
    {
      url: DOCS_API_BASE_URL,
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, '../docs/**/*.yaml')],
};

const swaggerDoc = swaggerJsDoc(options);

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

server.use(handleErrorMiddleware);

server.on('close', () => {
  logger.log('APP', `SERVER CLOSED`);
});

server.on('error', (error) => {
  console.error('Express App Error:', error);
});

export default server;
