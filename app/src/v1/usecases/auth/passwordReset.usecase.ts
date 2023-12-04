import { exceptionService } from '../../core/errors/exceptions';
import {
  IUserPasswordResetInformationsRepository,
  userPasswordResetInformationRepository,
} from '../../data/repositories/userPasswordResetInformation.repository';
import { IUsersRepository, usersRepo } from '../../data/repositories/users.repository';
import { IUser } from '../../domain/users/user';
import * as bcryptjs from 'bcryptjs';
import { validatePayloadSchema } from '../../utils/validation/validate.schema';
import passwordResetSchema from '../../presenters/schemas/auth/passwordReset.schema';

export type PasswordResetPayload = {
  newPassword: string;
  verifyNewPassword: string;
  token: string;
};
export type PasswordResetUseCaseType = (payload: PasswordResetPayload) => Promise<{ user: IUser }>;

export const passwordResetUseCaseBase =
  (dependencies: {
    usersRepo: IUsersRepository;
    userPasswordResetInformationsRepo: IUserPasswordResetInformationsRepository;
  }) =>
  async (payload: PasswordResetPayload) => {
    validatePasswordResetPayload(payload);
    const passwordResetInformationFound =
      await dependencies.userPasswordResetInformationsRepo.findOne({
        where: {
          token: payload.token,
        },
        relations: {
          user: true,
        },
      });
    if (!passwordResetInformationFound) {
      exceptionService.unauthorizedException({
        message:
          'Action non autorisée, veuillez utiliser le lien que vous avez reçu dans votre email',
      });
    }
    if (!passwordResetInformationFound.user) {
      exceptionService.badRequestException({
        message: "Ce compte n'existe plus",
      });
    }
    if (passwordResetInformationFound.expirationDate < new Date()) {
      exceptionService.badRequestException({
        message: 'la réinitialisation du mot de passe a expiré',
      });
    }
    const salt = bcryptjs.genSaltSync(10);
    const password = bcryptjs.hashSync(payload.newPassword, salt);
    const updatedUser = await dependencies.usersRepo.updateOne(passwordResetInformationFound.user, {
      password: password,
    });
    await dependencies.userPasswordResetInformationsRepo.deleteOne(passwordResetInformationFound);
    return {
      user: updatedUser as IUser,
    };
  };

export function validatePasswordResetPayload(payload: PasswordResetPayload): boolean {
  validatePayloadSchema(passwordResetSchema, payload);
  return true;
}

export const passwordResetUseCase: PasswordResetUseCaseType = passwordResetUseCaseBase({
  usersRepo,
  userPasswordResetInformationsRepo: userPasswordResetInformationRepository,
});
