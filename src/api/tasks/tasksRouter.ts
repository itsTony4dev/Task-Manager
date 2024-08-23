import express, { Request, Router, Response } from "express";
import { GetTaskRequest, InsertTask } from "./tasksModel";
import { taskService } from "./taskService";
import { handleServiceResponse } from "../../middleware/validateRequest";

export const tasksRouter: Router = (() => {
  const router = express.Router();
  router.get("/", async (req: Request, res: Response) => {
    const { pageIndex, pageSize, label } =
      req.query as unknown as GetTaskRequest;
    const ServiceResponse = await taskService.findAll({
      userId: req.user.id,
      pageIndex: pageIndex,
      pageSize: pageSize,
      label: label,
    });
    handleServiceResponse(ServiceResponse, res);
  });
  router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const ServiceResponse = await taskService.findTaskById(id);
    handleServiceResponse(ServiceResponse, res);
  });
  router.post("/", async (req: Request, res: Response) => {
    const createTaskRequest = req.body as unknown as InsertTask;
    const ServiceResponse = await taskService.createTask(createTaskRequest);
    handleServiceResponse(ServiceResponse, res);
  });
  router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const ServiceResponse = await taskService.deleteTask(id);
    handleServiceResponse(ServiceResponse, res);
  });
  router.put("/;id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateTaskRequest = req.body as unknown as InsertTask;
    const ServiceResponse = await taskService.updateTask(updateTaskRequest, id);
    handleServiceResponse(ServiceResponse, res);
  });
  return router;
})();
