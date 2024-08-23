import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "../../common/models/serviceResponse";
import { InsertTask, Task } from "./tasksModel";
import { tasksRepository } from "./tasksRepository";
import { logger } from "../../server";

export const taskService = {
  findAll: async (filters: {
    userId: string;
    pageIndex: number;
    pageSize: number;
    label?: string;
  }): Promise<ServiceResponse<Task[] | null>> => {
    try {
      const { pageIndex, pageSize, userId, label } = filters;
      const offset = (pageIndex - 1) * pageSize;

      const { tasks, totalCount } = await tasksRepository.finAllAsync({
        limit: pageSize,
        offset,
        userId,
        label,
      });

      if (tasks.length === 0)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "something went wrong!",
          null,
          StatusCodes.BAD_REQUEST
        );

      const totalPages = Math.ceil(totalCount / pageSize);
      const paginationInfo = {
        currentPage: pageIndex,
        pageSize,
        totalCount,
        totalPages,
      };
      const successMessage = `Tasks fetched successfully. 
                              Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}. 
                              Total tasks: ${paginationInfo.totalCount}.`;
      logger.info(successMessage);
      return new ServiceResponse(
        ResponseStatus.Success,
        successMessage,
        tasks,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error fetching tasks : ${(ex as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findTaskById: async (id: string): Promise<ServiceResponse<Task | null>> => {
    try {
      const task = await tasksRepository.findtaskByIdAsync(id);
      if (!task)
        return new ServiceResponse(
          ResponseStatus.Success,
          "task not found",
          null,
          StatusCodes.NOT_FOUND
        );
      return new ServiceResponse(
        ResponseStatus.Success,
        "task fetched successfully",
        task,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error fetching task : ${(ex as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  createTask: async (
    task: InsertTask
  ): Promise<ServiceResponse<Task | null>> => {
    try {
      if (!task)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "check your inputs",
          null,
          StatusCodes.BAD_REQUEST
        );
      const result = await tasksRepository.creatTask(task);
      return new ServiceResponse(
        ResponseStatus.Success,
        "task created successfully",
        result,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error creating task : ${(ex as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  deleteTask: async (id: string): Promise<ServiceResponse<Task | null>> => {
    try {
      const task = await tasksRepository.findtaskByIdAsync(id);
      if (!task)
        return new ServiceResponse(
          ResponseStatus.Success,
          "task not found",
          null,
          StatusCodes.NOT_FOUND
        );
      const result = await tasksRepository.deleteTaskAsync(id);
      if (!result)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "something went wrong!",
          null,
          StatusCodes.BAD_REQUEST
        );
      return new ServiceResponse(
        ResponseStatus.Success,
        "task deleted successfully",
        result,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error deleting task : ${(ex as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  updateTask: async (
    task: InsertTask,
    id: string
  ): Promise<ServiceResponse<Task | null>> => {
    try {
      const task = await tasksRepository.findtaskByIdAsync(id);
      if (!task)
        return new ServiceResponse(
          ResponseStatus.Success,
          "task not found",
          null,
          StatusCodes.NOT_FOUND
        );
      const result = await tasksRepository.updateTaskAsync(task, id);
      if (!result)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "something went wrong!",
          null,
          StatusCodes.BAD_REQUEST
        );
      return new ServiceResponse(
        ResponseStatus.Success,
        "task updated successfully",
        result,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error updating task : ${(ex as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
