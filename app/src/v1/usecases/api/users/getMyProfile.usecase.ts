import { exceptionService } from '../../../core/errors/exceptions';
import { IUsersRepository, usersRepo } from '../../../data/repositories/users.repository';
import { IUser } from '../../../domain/users/user';
import { IRequestUser } from '../../auth/types/IRequestUser';

export type GetMyProfileUseCaseType = (user: IRequestUser) => Promise<IUser>;

export const getMyProfileUseCaseBase =
  (dependencies: { usersRepo: IUsersRepository }) => async (user: IRequestUser) => {
    const userFound = await dependencies.usersRepo.findOne({
      where: {
        id: parseInt(user.id),
      },
    });
    if (!userFound) {
      exceptionService.notFoundException({
        message: "Le compte n'est pas trouvé",
      });
    }
    return userFound;
  };

export const getMyProfileUseCase: GetMyProfileUseCaseType = getMyProfileUseCaseBase({
  usersRepo: usersRepo,
});
