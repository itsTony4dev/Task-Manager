import {
  ResponseStatus,
  ServiceResponse,
} from "../../common/models/serviceResponse";
import { InsertUser, User } from "./userModel";
import { userReposiroty } from "./userRepository";
import bcrypt from 'bcrypt';

export const userService = {
  findAll: async (): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userReposiroty.findAllAsync();
      if (!users)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "something went wrong",
          null,
          400
        );
      return new ServiceResponse(
        ResponseStatus.Success,
        "users fetched successfuly",
        users,
        200
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `error fetching users :${(ex as Error).message}`,
        null,
        500
      );
    }
  },

  findById: async (id: string): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userReposiroty.findUserByIdAsync(id);
      if (!user)
        return new ServiceResponse(
          ResponseStatus.Success,
          "user not found",
          null,
          404
        );
      return new ServiceResponse(
        ResponseStatus.Success,
        "user found",
        user,
        200
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `error fetching user :${(ex as Error).message}`,
        null,
        500
      );
    }
  },
  createUser: async (
    user: InsertUser
  ): Promise<ServiceResponse<User | null>> => {
    try {
      const findExistingUser = await userReposiroty.findUserByEmailAsync(
        user.email
      );
      if (findExistingUser)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "user already exists",
          null,
          400
        );
        const userPassword = await bcrypt.hash(user.password,10);
        user.password = userPassword;
        const createdUser = await userReposiroty.createUserAsync(user);
        return new ServiceResponse(
            ResponseStatus.Success,
            "user created",
            createdUser,
            201
        );
    } catch (ex) {
        return new ServiceResponse(
            ResponseStatus.Failed,
            `error creating user :${(ex as Error).message}`,
            null,
            500
            );
    }
  },
};
