import { z } from "zod";
import { tasks } from "../../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectTaskSchema = createSelectSchema(tasks);
export type Task = z.infer<typeof SelectTaskSchema>;

export const InsertTaskSchema = createInsertSchema(tasks);
export type InsertTask = z.infer<typeof InsertTaskSchema>;
