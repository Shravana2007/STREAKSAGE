import { pgTable, text, serial, integer, boolean, date, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  bestStreak: integer("best_streak").default(0),
  totalTasks: integer("total_tasks").default(0),
  perfectDays: integer("perfect_days").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  emoji: text("emoji").notNull(),
  isWeekend: boolean("is_weekend").default(false),
  streak: integer("streak").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const taskCompletions = pgTable("task_completions", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  userId: integer("user_id").notNull(),
  completedAt: date("completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  source: text("source").notNull(),
  chapter: text("chapter"),
  verse: text("verse"),
  isActive: boolean("is_active").default(true),
});

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const streakHistory = pgTable("streak_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  completedTasks: integer("completed_tasks").default(0),
  totalTasks: integer("total_tasks").default(0),
  completionRate: integer("completion_rate").default(0), // percentage
  isPerfectDay: boolean("is_perfect_day").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertTaskCompletionSchema = createInsertSchema(taskCompletions).omit({
  id: true,
  createdAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
});

export const insertReflectionSchema = createInsertSchema(reflections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStreakHistorySchema = createInsertSchema(streakHistory).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type InsertTaskCompletion = z.infer<typeof insertTaskCompletionSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type Reflection = typeof reflections.$inferSelect;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;

export type StreakHistory = typeof streakHistory.$inferSelect;
export type InsertStreakHistory = z.infer<typeof insertStreakHistorySchema>;

// Combined types for API responses
export type TaskWithCompletion = Task & {
  isCompletedToday: boolean;
  completionDate?: string;
};

export type DailyProgress = {
  date: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  isPerfectDay: boolean;
};

export type UserStats = {
  currentStreak: number;
  bestStreak: number;
  totalTasks: number;
  perfectDays: number;
  weekProgress: number[];
  nextMilestone: number;
};
