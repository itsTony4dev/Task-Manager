import { InsertTask, SelectTaskSchema, Task } from "./tasksModel";
import { tasks } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db";

export const tasksRepository = {
  finAllAsync: async (filters: {
    limit: number;
    offset: number;
    userId: string;
  }): Promise<{ tasks: Task[]; totalCount: number }> => {
    const [totalCountResult, result] = await Promise.all([
      db
        .select({ count: sql`count(*)` })
        .from(tasks)
        .where(eq(tasks.userId, filters.userId)),
      db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, filters.userId))
        .limit(filters.limit)
        .offset(filters.offset)
        .execute(),
    ]);

    const parsedTasks = result.map((row: any) => {
      return SelectTaskSchema.parse(row);
    });

    return {
      tasks: parsedTasks,
      totalCount: Number(totalCountResult[0].count),
    };
  },
  findTasksByLabelAsync: async (
    userId: string,
    label: string
  ): Promise<Task[]> => {
    const result = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.label, label)))
      .execute();
    return result.map((row: any) => SelectTaskSchema.parse(row));
  },
  findtaskById: async (id: string): Promise<Task | null> => {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .execute();
    return result.length > 0 ? SelectTaskSchema.parse(result[0]) : null;
  },
  creatTask: async (task: InsertTask): Promise<Task | null> => {
    const result = await db.insert(tasks).values(task).execute();
    return result.length > 0 ? SelectTaskSchema.parse(result[0]) : null;
  },
  deleteTaskAsync: async (id: string): Promise<Task | null> => {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning()
      .execute();
    return result.length > 0 ? SelectTaskSchema.parse(result[0]) : null;
  },
  updateTaskAsync: async (
    task: InsertTask,
    id: string
  ): Promise<Task | null> => {
    const result = await db
      .update(tasks)
      .set(task)
      .where(eq(tasks.id, id))
      .returning();
    return result.length > 0 ? SelectTaskSchema.parse(result[0]) : null;
  },
};
