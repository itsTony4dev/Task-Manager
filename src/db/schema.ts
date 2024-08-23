import { uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 20 }).notNull(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 50 }).notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 50 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull(),
  priority: varchar("priority", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  dueDate: timestamp("due_date"),
  label: varchar("label", { length: 20 }),
  userId: uuid("user_id").references(() => user.id),
});
