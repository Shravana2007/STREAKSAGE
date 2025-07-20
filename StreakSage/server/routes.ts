import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, 
  insertTaskCompletionSchema, 
  insertReflectionSchema,
  insertStreakHistorySchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Default user ID (since we're not implementing auth)
  const DEFAULT_USER_ID = 1;

  // Get user profile and stats
  app.get("/api/user/profile", async (req, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Get user statistics
  app.get("/api/user/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(DEFAULT_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Get tasks for current user
  app.get("/api/tasks", async (req, res) => {
    try {
      const isWeekend = req.query.weekend === 'true';
      const tasks = await storage.getUserTasks(DEFAULT_USER_ID, isWeekend);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Create new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  // Complete a task
  app.post("/api/tasks/:taskId/complete", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already completed today
      const existingCompletions = await storage.getTaskCompletions(DEFAULT_USER_ID, today);
      const alreadyCompleted = existingCompletions.some(completion => completion.taskId === taskId);
      
      if (alreadyCompleted) {
        return res.status(400).json({ message: "Task already completed today" });
      }

      const completionData = insertTaskCompletionSchema.parse({
        taskId,
        userId: DEFAULT_USER_ID,
        completedAt: today,
      });

      const completion = await storage.completeTask(completionData);

      // Update daily progress
      const allTasks = await storage.getUserTasks(DEFAULT_USER_ID);
      const todayCompletions = await storage.getTaskCompletions(DEFAULT_USER_ID, today);
      const totalTasks = allTasks.length;
      const completedTasks = todayCompletions.length;
      const completionRate = Math.round((completedTasks / totalTasks) * 100);
      const isPerfectDay = completedTasks === totalTasks;

      await storage.updateDailyProgress({
        userId: DEFAULT_USER_ID,
        date: today,
        completedTasks,
        totalTasks,
        completionRate,
        isPerfectDay,
      });

      // Update user stats if perfect day
      if (isPerfectDay) {
        const user = await storage.getUser(DEFAULT_USER_ID);
        if (user) {
          const newStreak = user.currentStreak + 1;
          await storage.updateUserStats(DEFAULT_USER_ID, {
            currentStreak: newStreak,
            bestStreak: Math.max(user.bestStreak, newStreak),
            totalTasks: user.totalTasks + 1,
            perfectDays: user.perfectDays + (isPerfectDay ? 1 : 0),
          });
        }
      }

      res.status(201).json(completion);
    } catch (error) {
      res.status(400).json({ message: "Failed to complete task" });
    }
  });

  // Get daily quote
  app.get("/api/quote/daily", async (req, res) => {
    try {
      const quote = await storage.getDailyQuote();
      if (!quote) {
        return res.status(404).json({ message: "No quote available" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily quote" });
    }
  });

  // Get reflection for specific date
  app.get("/api/reflections/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const reflection = await storage.getReflection(DEFAULT_USER_ID, date);
      if (!reflection) {
        return res.status(404).json({ message: "No reflection found for this date" });
      }
      res.json(reflection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflection" });
    }
  });

  // Save reflection
  app.post("/api/reflections", async (req, res) => {
    try {
      const reflectionData = insertReflectionSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const reflection = await storage.saveReflection(reflectionData);
      res.json(reflection);
    } catch (error) {
      res.status(400).json({ message: "Failed to save reflection" });
    }
  });

  // Get streak history
  app.get("/api/streak/history", async (req, res) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const history = await storage.getStreakHistory(DEFAULT_USER_ID, startDate, endDate);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch streak history" });
    }
  });

  // Get current date info (useful for frontend)
  app.get("/api/date/current", async (req, res) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const isWeekend = now.getDay() === 0 || now.getDay() === 6;
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      res.json({
        date: today,
        isWeekend,
        hour,
        minute,
        isMorningQuoteTime: hour === 6,
        isEveningReminderTime: hour === 21 && minute >= 30,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current date" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
