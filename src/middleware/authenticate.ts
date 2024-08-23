import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import {
  ResponseStatus,
  ServiceResponse,
} from "../common/models/serviceResponse";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../api/user/userModel";

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return new ServiceResponse(
      ResponseStatus.Failed,
      "not authorized",
      null,
      StatusCodes.UNAUTHORIZED
    );

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as User;
    next();
  });
}

export default authenticateToken;
