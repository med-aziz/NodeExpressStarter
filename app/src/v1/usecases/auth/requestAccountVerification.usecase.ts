import { FRONT_END_BASE_URL } from '../../../config';
import { exceptionService } from '../../core/errors/exceptions';
import { IUsersRepository, usersRepo } from '../../data/repositories/users.repository';
import { IUser } from '../../domain/users/user';
import {
  MailUserAccountVerificationUseCaseType,
  sendUserVerificationMailUseCase,
} from '../api/mailing/sendVerificationMail.usecase';
import { generateAccountVerificationTokenForUser } from '../../utils/tokenUtils/generateAccountVerificationToken.util';
import { IRequestUser } from './types/IRequestUser';
import { ACCOUNT_NOT_FOUND_ERROR_MESSAGE } from '../../domain/auth/errors';

export type RequestAccountVerificationUseCaseType = (
  payload: IRequestUser,
) => Promise<{ user: IUser }>;

export const requestAccountVerificationUseCaseBase =
  (dependencies: {
    usersRepo: IUsersRepository;
    sendUserAccountVerification: MailUserAccountVerificationUseCaseType;
  }) =>
  async (user: IRequestUser) => {
    const userFound = await dependencies.usersRepo.findOne({
      where: {
        id: parseInt(user.id),
        confirmed_email: false,
      },
    });

    if (!userFound) {
      exceptionService.notFoundException({
        message: ACCOUNT_NOT_FOUND_ERROR_MESSAGE,
      });
    }

    const verificationToken = generateAccountVerificationTokenForUser(userFound);

    await dependencies.usersRepo.updateOne(userFound, {
      confirmation_token: verificationToken,
    });

    const link = `${FRONT_END_BASE_URL}/verify-account/${verificationToken}`;

    await dependencies.sendUserAccountVerification(userFound, {
      link: link,
    });
    return {
      user: userFound,
    };
  };

export const requestAccountVerificationUseCase: RequestAccountVerificationUseCaseType =
  requestAccountVerificationUseCaseBase({
    usersRepo,
    sendUserAccountVerification: sendUserVerificationMailUseCase,
  });
