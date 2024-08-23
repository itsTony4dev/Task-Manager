import { z } from "zod";

import { user } from "../../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const SelectUserSchema = createSelectSchema(user);
export type User = z.infer<typeof SelectUserSchema>;

export const InsertUserSchema = createInsertSchema(user);
export type InsertUser = z.infer<typeof InsertUserSchema>;
