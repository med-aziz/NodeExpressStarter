import { TypeORMError } from 'typeorm';
import { ApiException } from '../../../core/errors/exceptions';
import { logger } from '../../../core/logger/logger';
import { NextFunction, Request, Response } from 'express';

export const createHandleErrorMiddleware =
  () => (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('ERROR', err.message, err.stack);
    if (err instanceof ApiException) {
      return res.status(err.status).json({
        error: err.description,
        message: err.message,
        ...err.payload,
      });
    }
    if (err instanceof TypeORMError) {
      const ormError = err as any;
      if (ormError.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          error: 'validation error',
          message: 'Cette entité existe déjà.',
        });
      }
    }
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'erreur serveur',
    });
    next();
  };

export const handleErrorMiddleware = createHandleErrorMiddleware();
