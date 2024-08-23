import { eq } from "drizzle-orm";
import { db } from "../../db";
import { user } from "../../db/schema";
import {
  InsertUser,
  InsertUserSchema,
  SelectUserSchema,
  User,
} from "./userModel";

export const userReposiroty = {
  findAllAsync: async (): Promise<User[]> => {
    try {
      const result = await db.select().from(user);
      return [SelectUserSchema.parse(result)];
    } catch (ex) {
      throw new Error("database ex");
    }
  },
  findUserByIdAsync: async (id: string): Promise<User | null> => {
    try {
      const result = await db.select().from(user).where(eq(user.id, id));
      return result.length > 0 ? SelectUserSchema.parse(result[0]) : null;
    } catch (ex) {
      throw new Error("database ex");
    }
  },
  createUserAsync: async (user1: InsertUser): Promise<User | null> => {
    try {
      InsertUserSchema.parse(user1);
      const result = await db.insert(user).values({ ...user1 });
      return result.length > 0 ? SelectUserSchema.parse(result[0]) : null;
    } catch (ex) {
      throw new Error("database ex");
    }
  },
  updateUserAsync: async (id: string, user1: User): Promise<User | null> => {
    try {
      const result = await db
        .update(user)
        .set({ ...user1 })
        .where(eq(user.id, id));
      return result.length > 0 ? SelectUserSchema.parse(result[0]) : null;
    } catch (ex) {
      throw new Error("database ex");
    }
  },
  deleteUserAsync: async (id: string): Promise<User | null> => {
    try {
      const result = await db.delete(user).where(eq(user.id, id));
      return result.length > 0 ? SelectUserSchema.parse(result[0]) : null;
    } catch (ex) {
      throw new Error("database ex");
    }
  },
  findUserByEmailAsync: async (email: string): Promise<User | null> => {
    const foundUser = await db.select().from(user).where(eq(user.email, email));
    return foundUser.length > 0 ? SelectUserSchema.parse(foundUser[0]) : null;
  },
};
