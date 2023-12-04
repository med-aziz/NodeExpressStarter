import { logger } from '../../core/logger/logger';
import { IUsersRepository, usersRepo } from '../../data/repositories/users.repository';
import * as bcryptjs from 'bcryptjs';
import { ICreateUserInput, IUser } from '../../domain/users/user';
import {
  RequestAccountVerificationUseCaseType,
  requestAccountVerificationUseCase,
} from './requestAccountVerification.usecase';
import { CreateUserTokensUseCaseType, createUserTokensUseCase } from './createUserTokens.usecase';
import { exceptionService } from '../../core/errors/exceptions';
import { validatePayloadSchema } from '../../utils/validation/validate.schema';
import registerSchema from '../../presenters/schemas/auth/register.schema';

export type RegisterUseCase = (
  payload: ICreateUserInput,
) => Promise<{ user: IUser; accessToken: string; refreshToken: string }>;

export const registerUseCaseBase =
  (
    dependencies: {
      usersRepo: IUsersRepository;
      requestAccountVerificationUseCase: RequestAccountVerificationUseCaseType;
      createUserTokensUseCase: CreateUserTokensUseCaseType;
    } = {
      usersRepo: usersRepo,
      requestAccountVerificationUseCase: requestAccountVerificationUseCase,
      createUserTokensUseCase: createUserTokensUseCase,
    },
  ): RegisterUseCase =>
  async (payload: ICreateUserInput) => {
    validateRegisterPayload(payload);
    const userFound = await dependencies.usersRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    if (userFound) {
      exceptionService.badRequestException({
        message: "Un compte déjà existe avec l'email que vous avez fourni",
      });
    }
    const salt = bcryptjs.genSaltSync(10);
    const password = bcryptjs.hashSync(payload.password, salt);
    const userCreated = await dependencies.usersRepo.create({
      email: payload.email,
      password: password,
      isEmailVerified: payload.isEmailVerified || false,
      firstName: payload.firstName,
      lastName: payload.lastName,
      confirmationToken: '',
      picture: payload.picture,
    });
    logger.log('REGISTER USE CASE', JSON.stringify(userCreated));
    await dependencies.requestAccountVerificationUseCase({
      email: payload.email,
      isVerified: false,
      id: userCreated.id,
    });
    const tokens = await dependencies.createUserTokensUseCase(userCreated);
    return {
      user: userCreated,
      ...tokens,
    };
  };

export function validateRegisterPayload(payload: ICreateUserInput): boolean {
  validatePayloadSchema(registerSchema, payload);
  return true;
}

export const registerUseCase: RegisterUseCase = registerUseCaseBase({
  usersRepo,
  requestAccountVerificationUseCase: requestAccountVerificationUseCase,
  createUserTokensUseCase: createUserTokensUseCase,
});
