import { IIdAsNumber, NumberId } from '../types/idAsNumber';

export interface IUser extends IIdAsNumber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  picture: string;
}

export class User extends NumberId implements IUser {
  id: string;
  email: string;
  isVerified: boolean;
  picture: string;
  firstName: string;
  lastName: string;
  constructor(payload: {
    id: string;
    email: string;
    isVerified: boolean;
    picture: string;
    firstName: string;
    lastName: string;
  }) {
    super(payload.id);
    this.email = payload.email;
    this.isVerified = payload.isVerified;
    this.picture = payload.picture;
    this.firstName = payload?.firstName;
    this.lastName = payload?.lastName;
  }
}

export interface ICreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isEmailVerified?: boolean;
  confirmationToken?: string;
  picture: string;
}

export interface IUserPasswordResetInformation extends IIdAsNumber {
  id: string;
  token: string;
  userId: number;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
}

export class UserPasswordResetInformation
  extends NumberId
  implements IUserPasswordResetInformation
{
  id: string;
  token: string;
  userId: number;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
  constructor(payload: {
    id: string;
    token: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    user?: IUser;
  }) {
    super(payload.id);
    this.token = payload.token;
    this.userId = payload.userId;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
    this.user = payload.user;
  }
}
export interface ICreateUserPasswordResetInformation {
  token: string;
  userId: string;
  expirationDate: Date;
}

export interface IUserOwnerProjectInput {
  userId: number;
  projectId: number;
}
