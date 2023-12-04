import { IJwtAccessPayload } from '../../../usecases/auth/types/jwt.tokens';
import { JWT_KEYS, TOKENS_INFO } from '../../../../config';
import { exceptionService } from '../../../core/errors/exceptions';
import { Request, Response, NextFunction } from 'express';
import * as jwtService from 'jsonwebtoken';
import { validateAccessToken } from './isAuthenticated.middleware';

export const isVerificationRequestPermissibledMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req?.cookies[TOKENS_INFO.ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    exceptionService.unauthorizedException({
      message: "s'il vous plait Connectez-vous d'abord",
    });
  }
  const accessTokenPayload = jwtService.verify(accessToken, JWT_KEYS.PUBLIC_KEY, {
    algorithms: ['RS256'],
  }) as IJwtAccessPayload;
  validateAccessToken(accessTokenPayload);
  if (accessTokenPayload.user.isVerified === true) {
    exceptionService.forbiddenException({
      message: 'ce compte est déjà vérifié',
    });
  }
  req.user = accessTokenPayload.user;
  next();
};
