import { logger } from '../../core/logger/logger';
import { IUsersRepository, usersRepo } from '../../data/repositories/users.repository';
import * as bcryptjs from 'bcryptjs';
import { ICreateUserInput, IUser } from '../../domain/users/user';
import { generateAndSendUserAccountVerificationEmail } from './requestAccountVerification.usecase';
import { CreateUserTokensUseCaseType, createUserTokensUseCase } from './createUserTokens.usecase';
import { exceptionService } from '../../core/errors/exceptions';
import { trimAndValidateSchemaPayload } from '../../utils/validation/validate.schema';
import registerSchema from '../../presenters/schemas/auth/register.schema';
import { ACCOUNT_ALREADY_EXISTS_ERROR_MESSAGE } from '../../domain/auth/errors';

export type RegisterUseCase = (
  payload: ICreateUserInput,
) => Promise<{ user: IUser; accessToken: string; refreshToken: string }>;

export const registerUseCaseBase =
  (
    dependencies: {
      usersRepo: IUsersRepository;
      generateAndSendUserAccountVerificationEmail: typeof generateAndSendUserAccountVerificationEmail;
      createUserTokensUseCase: CreateUserTokensUseCaseType;
    } = {
      usersRepo: usersRepo,
      generateAndSendUserAccountVerificationEmail: generateAndSendUserAccountVerificationEmail,
      createUserTokensUseCase: createUserTokensUseCase,
    },
  ): RegisterUseCase =>
  async (payload: ICreateUserInput) => {
    validateRegisterPayload(payload);
    const userFound = await dependencies.usersRepo.findOne({
      where: [{ email: payload.email }, { username: payload.username }],
    });
    if (userFound) {
      exceptionService.badRequestException({
        message: ACCOUNT_ALREADY_EXISTS_ERROR_MESSAGE,
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
      username: payload.username,
    });
    logger.log('REGISTER USE CASE', JSON.stringify(userCreated));
    await dependencies.generateAndSendUserAccountVerificationEmail(
      userCreated,
      dependencies.usersRepo,
    );
    const tokens = await dependencies.createUserTokensUseCase(userCreated);
    return {
      user: userCreated,
      ...tokens,
    };
  };

export function validateRegisterPayload(payload: ICreateUserInput): ICreateUserInput {
  trimAndValidateSchemaPayload<ICreateUserInput>(registerSchema, payload);
  return payload;
}

export const registerUseCase: RegisterUseCase = registerUseCaseBase({
  usersRepo,
  generateAndSendUserAccountVerificationEmail: generateAndSendUserAccountVerificationEmail,
  createUserTokensUseCase: createUserTokensUseCase,
});
