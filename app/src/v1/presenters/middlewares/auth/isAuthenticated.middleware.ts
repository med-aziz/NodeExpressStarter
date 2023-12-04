import { JWT_KEYS, TOKENS_INFO } from '../../../../config';
import { exceptionService } from '../../../core/errors/exceptions';
import { IJwtAccessPayload } from '../../../usecases/auth/types/jwt.tokens';
import { Request, Response, NextFunction } from 'express';
import * as jwtService from 'jsonwebtoken';

export const isAuthentictedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies[TOKENS_INFO.ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      exceptionService.unauthorizedException({
        message: "s'il vous plait Connectez-vous d'abord",
      });
    }
    const accessTokenPayload = jwtService.verify(accessToken, JWT_KEYS.PUBLIC_KEY, {
      algorithms: ['RS256'],
    }) as IJwtAccessPayload;
    validateAccessToken(accessTokenPayload);
    if (accessTokenPayload.user.isVerified !== true) {
      exceptionService.unauthorizedException({
        message: "veuillez d'abord vérifier votre compte",
      });
    }
    req.user = accessTokenPayload.user;
    next();
  } catch (err) {
    // res.clearCookie(TOKENS_INFO.ACCESS_TOKEN_COOKIE_NAME);
    throw err;
  }
};
export const isAuthentictedMiddlewareNoVerificationNeeded = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies[TOKENS_INFO.ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      exceptionService.unauthorizedException({
        message: "s'il vous plait Connectez-vous d'abord",
      });
    }
    const accessTokenPayload = jwtService.verify(accessToken, JWT_KEYS.PUBLIC_KEY, {
      algorithms: ['RS256'],
    }) as IJwtAccessPayload;
    validateAccessToken(accessTokenPayload);
    req.user = accessTokenPayload.user;
    next();
  } catch (err) {
    // res.clearCookie(TOKENS_INFO.ACCESS_TOKEN_COOKIE_NAME);
    throw err;
  }
};

export const validateAccessToken = (tokenPayload: IJwtAccessPayload) => {
  if (
    !tokenPayload ||
    !tokenPayload.iss ||
    !tokenPayload.user ||
    !tokenPayload.aud ||
    tokenPayload.iss !== TOKENS_INFO.ISSUER ||
    tokenPayload.aud !== TOKENS_INFO.AUDIENCE
  )
    exceptionService.unauthorizedException({ message: 'access token invalide' });
  return true;
};
