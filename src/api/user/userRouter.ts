import express, { Request, Response, Router } from "express";
import { userService } from "./userService";
import { handleServiceResponse } from "../../middleware/validateRequest";

export const userRouter: Router = (() => {
  const router = express.Router();
  router.get("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const ServiceResponse = await userService.login(email, password);
    handleServiceResponse(ServiceResponse, res);
  });
  router.post("/signup", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const ServiceResponse = await userService.signup(name, email, password);
    handleServiceResponse(ServiceResponse, res);
  });
  router.post('/refresh-token', async (req: Request, res: Response) => {
    const { refreshToken } = req.body ;
    const serviceResponse = await userService.refreshToken(refreshToken);
    handleServiceResponse(serviceResponse, res);
  });
  return router;
})();
