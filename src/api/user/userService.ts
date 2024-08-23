import {
  ResponseStatus,
  ServiceResponse,
} from "../../common/models/serviceResponse";
import { InsertUser, User } from "./userModel";
import { userReposiroty } from "./userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
dotenv.config();

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
      const userPassword = await bcrypt.hash(user.password, 10);
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
  login: async (
    email: string,
    password: string
  ): Promise<ServiceResponse<User | null>> => {
    try {
      const findUser = await userReposiroty.findUserByEmailAsync(email);
      if (!findUser)
        return new ServiceResponse(
          ResponseStatus.Success,
          "user not found",
          null,
          404
        );
      const match = await bcrypt.compare(findUser.password, password);
      if (!match)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "incorect credentials",
          null,
          400
        );
      const accessToken = jwt.sign(
        { id: findUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "login successful",
        { ...findUser, accessToken },
        200
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
  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<ServiceResponse<User | null>> => {
    try {
      const findUser = await userReposiroty.findUserByEmailAsync(email);
      if (findUser)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "user already exists",
          null,
          400
        );
      const createdUser = await userReposiroty.createUserAsync({
        name,
        email,
        password,
      });
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

  refreshtoken: async (
    token: string
  ): Promise<ServiceResponse<{ token: string } | null>> => {
    try {
      if (!token) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Refresh token is required",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const decode = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      ) as { id: string; email: string; name: string };
      const user = await userReposiroty.findUserByIdAsync(decode.id);
      if (!user)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "user not found",
          null,
          StatusCodes.NOT_FOUND
        );
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "login successful",
        { token: accessToken },
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `error creating user :${(ex as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
