import { logger } from '../../core/logger/logger';
import { IUsersRepository, usersRepo } from '../../data/repositories/users.repository';
import { IVerifyAccountInput } from './types/verifyAccount';
import { IUser } from '../../domain/users/user';
import { CreateUserTokensUseCaseType, createUserTokensUseCase } from './createUserTokens.usecase';
import { exceptionService } from '../../core/errors/exceptions';
import { validatePayloadSchema } from '../../utils/validation/validate.schema';
import verifyAccountSchema from '../../presenters/schemas/auth/verifyAccount.schema';

export type VerifyAccountUseCaseType = (
  payload: IVerifyAccountInput,
) => Promise<{ user: IUser; accessToken: string; refreshToken: string }>;

export const verifyAccountUseCaseBase =
  (
    dependencies: {
      usersRepo: IUsersRepository;
      createUserTokensUseCase: CreateUserTokensUseCaseType;
    } = { usersRepo: usersRepo, createUserTokensUseCase: createUserTokensUseCase },
  ): VerifyAccountUseCaseType =>
  async (payload: IVerifyAccountInput) => {
    validateVerifyAccountPayload(payload);
    const userFound = await dependencies.usersRepo.findOne({
      where: {
        confirmation_token: payload.code,
        confirmed_email: false,
      },
    });

    if (!userFound) {
      logger.log('VERIFY ACCOUNT USE CASE', `FAILED TOKEN ${payload.code}`);
      exceptionService.badRequestException({
        message: "Merci d'envoyer le code reçu dans votre email",
      });
    }

    const updatedUser = await dependencies.usersRepo.updateOne(userFound, {
      confirmed_email: true,
    });

    logger.log('VERIFY ACCOUNT USE CASE', `SUCCEEDED FOR USER ${userFound.id}`);

    const result = await dependencies.createUserTokensUseCase(updatedUser);

    return {
      user: updatedUser,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  };

export function validateVerifyAccountPayload(payload: IVerifyAccountInput): true {
  validatePayloadSchema(verifyAccountSchema, payload);
  return true;
}

export const verifyAccountUseCase: VerifyAccountUseCaseType = verifyAccountUseCaseBase({
  usersRepo,
  createUserTokensUseCase,
});
