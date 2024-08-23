import { InsertTask, SelectTaskSchema, Task } from "./tasksModel";
import { tasks } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db";

export const tasksRepository = {
  finAllAsync: async (filters: {
    limit: number;
    offset: number;
    userId: string;
    label?: string;
  }): Promise<{ tasks: Task[]; totalCount: number }> => {
    // Create a function to apply filters
    const applyFilters = (query: any) => {
      query = query.where(eq(tasks.userId, filters.userId));
      if (filters.label) {
        query = query.where(eq(tasks.label, filters.label));
      }
      return query;
    };

    const [totalCountResult, result] = await Promise.all([
      applyFilters(db.select({ count: sql`count(*)` }).from(tasks)),
      applyFilters(db.select().from(tasks))
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
  findtaskByIdAsync: async (id: string): Promise<Task | null> => {
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
