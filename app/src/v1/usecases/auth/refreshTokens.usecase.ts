import { exceptionService } from '../../core/errors/exceptions';
import { IUsersRepository, usersRepo } from '../../data/repositories/users.repository';
import { IUser } from '../../domain/users/user';
import { createUserAccessToken, createUserRefreshToken } from './createUserTokens.usecase';
import { IRequestUser } from './types/IRequestUser';
export type RefreshUserTokensUseCaseType = (
  payload: IRequestUser,
) => Promise<{ accessToken: string; refreshToken: string; user: IUser }>;

export const refreshUserTokensUseCaseBase =
  (
    dependencies: { usersRepo: IUsersRepository } = { usersRepo: usersRepo },
  ): RefreshUserTokensUseCaseType =>
  async (user: IRequestUser) => {
    const userFound = await dependencies.usersRepo.findOne({
      where: {
        id: parseInt(user.id),
      },
    });
    if (!userFound) {
      exceptionService.unauthorizedException({
        message: "Votre compte n'existe plus",
      });
    }
    const accessToken = createUserAccessToken(userFound);
    const refreshToken = createUserRefreshToken(userFound);
    return {
      user: userFound,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };

export const refreshUserTokensUseCase: RefreshUserTokensUseCaseType = refreshUserTokensUseCaseBase({
  usersRepo: usersRepo,
});