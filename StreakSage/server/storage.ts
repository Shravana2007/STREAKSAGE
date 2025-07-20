import { 
  users, tasks, taskCompletions, quotes, reflections, streakHistory,
  type User, type InsertUser, 
  type Task, type InsertTask, type TaskWithCompletion,
  type TaskCompletion, type InsertTaskCompletion,
  type Quote, type InsertQuote,
  type Reflection, type InsertReflection,
  type StreakHistory, type InsertStreakHistory,
  type DailyProgress, type UserStats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(id: number, stats: Partial<User>): Promise<User | undefined>;

  // Task operations
  getUserTasks(userId: number, isWeekend?: boolean): Promise<TaskWithCompletion[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Task completion operations
  completeTask(completion: InsertTaskCompletion): Promise<TaskCompletion>;
  getTaskCompletions(userId: number, date: string): Promise<TaskCompletion[]>;
  getUserTaskCompletions(userId: number, taskId: number): Promise<TaskCompletion[]>;

  // Quote operations
  getDailyQuote(): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;

  // Reflection operations
  getReflection(userId: number, date: string): Promise<Reflection | undefined>;
  saveReflection(reflection: InsertReflection): Promise<Reflection>;

  // Streak operations
  getStreakHistory(userId: number, startDate?: string, endDate?: string): Promise<StreakHistory[]>;
  updateDailyProgress(progress: InsertStreakHistory): Promise<StreakHistory>;
  getUserStats(userId: number): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private taskCompletions: Map<number, TaskCompletion>;
  private quotes: Map<number, Quote>;
  private reflections: Map<number, Reflection>;
  private streakHistory: Map<number, StreakHistory>;
  
  private currentUserId: number;
  private currentTaskId: number;
  private currentCompletionId: number;
  private currentQuoteId: number;
  private currentReflectionId: number;
  private currentStreakId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.taskCompletions = new Map();
    this.quotes = new Map();
    this.reflections = new Map();
    this.streakHistory = new Map();
    
    this.currentUserId = 1;
    this.currentTaskId = 1;
    this.currentCompletionId = 1;
    this.currentQuoteId = 1;
    this.currentReflectionId = 1;
    this.currentStreakId = 1;

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "user",
      currentStreak: 47,
      bestStreak: 47,
      totalTasks: 1247,
      perfectDays: 34,
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Default tasks
    const defaultTasks: Task[] = [
      { id: 1, userId: 1, title: "Morning Meditation", description: "10 minutes of mindfulness", emoji: "🧘", isWeekend: false, streak: 7, isActive: true, createdAt: new Date() },
      { id: 2, userId: 1, title: "Read 20 Pages", description: "Personal development book", emoji: "📚", isWeekend: false, streak: 12, isActive: true, createdAt: new Date() },
      { id: 3, userId: 1, title: "Exercise", description: "30 minutes workout", emoji: "💪", isWeekend: false, streak: 3, isActive: true, createdAt: new Date() },
      { id: 4, userId: 1, title: "Hydration", description: "8 glasses of water", emoji: "💧", isWeekend: false, streak: 21, isActive: true, createdAt: new Date() },
      { id: 5, userId: 1, title: "Gratitude Journal", description: "3 things I'm grateful for", emoji: "📝", isWeekend: false, streak: 15, isActive: true, createdAt: new Date() },
      { id: 6, userId: 1, title: "Learn Something New", description: "15 minutes skill building", emoji: "🌱", isWeekend: false, streak: 5, isActive: true, createdAt: new Date() },
    ];

    defaultTasks.forEach(task => this.tasks.set(task.id, task));
    this.currentTaskId = 7;

    // Default quotes from Bhagavad Gita
    const defaultQuotes: Quote[] = [
      { id: 1, text: "You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction.", source: "Bhagavad Gita", chapter: "Chapter 2", verse: "Verse 47", isActive: true },
      { id: 2, text: "The mind is restless and difficult to restrain, but it is subdued by practice.", source: "Bhagavad Gita", chapter: "Chapter 6", verse: "Verse 35", isActive: true },
      { id: 3, text: "A person can rise through the efforts of his own mind; or draw himself down, in the same manner. Because each person is his own friend or enemy.", source: "Bhagavad Gita", chapter: "Chapter 6", verse: "Verse 5", isActive: true },
      { id: 4, text: "Whatever action is performed by a great man, common men follow in his footsteps, and whatever standards he sets by exemplary acts, all the world pursues.", source: "Bhagavad Gita", chapter: "Chapter 3", verse: "Verse 21", isActive: true },
      { id: 5, text: "You came empty handed, you will leave empty handed. What is yours today, belonged to someone else yesterday, and will belong to someone else the day after tomorrow.", source: "Bhagavad Gita", chapter: "Chapter 2", verse: "Verse 20", isActive: true },
    ];

    defaultQuotes.forEach(quote => this.quotes.set(quote.id, quote));
    this.currentQuoteId = 6;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      currentStreak: 0,
      bestStreak: 0,
      totalTasks: 0,
      perfectDays: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStats(id: number, stats: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...stats };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserTasks(userId: number, isWeekend?: boolean): Promise<TaskWithCompletion[]> {
    const userTasks = Array.from(this.tasks.values())
      .filter(task => task.userId === userId && task.isActive);
    
    if (isWeekend !== undefined) {
      userTasks.filter(task => task.isWeekend === isWeekend);
    }

    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = Array.from(this.taskCompletions.values())
      .filter(completion => completion.userId === userId && completion.completedAt === today);

    return userTasks.map(task => ({
      ...task,
      isCompletedToday: todayCompletions.some(completion => completion.taskId === task.id),
      completionDate: todayCompletions.find(completion => completion.taskId === task.id)?.completedAt,
    }));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: new Date(),
      streak: 0,
      isActive: true,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async completeTask(insertCompletion: InsertTaskCompletion): Promise<TaskCompletion> {
    const id = this.currentCompletionId++;
    const completion: TaskCompletion = { 
      ...insertCompletion, 
      id, 
      createdAt: new Date() 
    };
    this.taskCompletions.set(id, completion);

    // Update task streak
    const task = this.tasks.get(insertCompletion.taskId);
    if (task) {
      await this.updateTask(task.id, { streak: task.streak + 1 });
    }

    return completion;
  }

  async getTaskCompletions(userId: number, date: string): Promise<TaskCompletion[]> {
    return Array.from(this.taskCompletions.values())
      .filter(completion => completion.userId === userId && completion.completedAt === date);
  }

  async getUserTaskCompletions(userId: number, taskId: number): Promise<TaskCompletion[]> {
    return Array.from(this.taskCompletions.values())
      .filter(completion => completion.userId === userId && completion.taskId === taskId);
  }

  async getDailyQuote(): Promise<Quote | undefined> {
    const activeQuotes = Array.from(this.quotes.values()).filter(quote => quote.isActive);
    if (activeQuotes.length === 0) return undefined;
    
    // Return a different quote based on the day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return activeQuotes[dayOfYear % activeQuotes.length];
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(quote => quote.isActive);
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.currentQuoteId++;
    const quote: Quote = { ...insertQuote, id };
    this.quotes.set(id, quote);
    return quote;
  }

  async getReflection(userId: number, date: string): Promise<Reflection | undefined> {
    return Array.from(this.reflections.values())
      .find(reflection => reflection.userId === userId && reflection.date === date);
  }

  async saveReflection(insertReflection: InsertReflection): Promise<Reflection> {
    // Check if reflection exists for this date
    const existing = await this.getReflection(insertReflection.userId, insertReflection.date);
    
    if (existing) {
      const updated: Reflection = {
        ...existing,
        content: insertReflection.content,
        updatedAt: new Date(),
      };
      this.reflections.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentReflectionId++;
      const reflection: Reflection = { 
        ...insertReflection, 
        id, 
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.reflections.set(id, reflection);
      return reflection;
    }
  }

  async getStreakHistory(userId: number, startDate?: string, endDate?: string): Promise<StreakHistory[]> {
    let history = Array.from(this.streakHistory.values())
      .filter(entry => entry.userId === userId);
    
    if (startDate) {
      history = history.filter(entry => entry.date >= startDate);
    }
    
    if (endDate) {
      history = history.filter(entry => entry.date <= endDate);
    }
    
    return history.sort((a, b) => a.date.localeCompare(b.date));
  }

  async updateDailyProgress(insertProgress: InsertStreakHistory): Promise<StreakHistory> {
    // Check if entry exists for this date
    const existing = Array.from(this.streakHistory.values())
      .find(entry => entry.userId === insertProgress.userId && entry.date === insertProgress.date);
    
    if (existing) {
      const updated: StreakHistory = { ...existing, ...insertProgress };
      this.streakHistory.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentStreakId++;
      const progress: StreakHistory = { ...insertProgress, id };
      this.streakHistory.set(id, progress);
      return progress;
    }
  }

  async getUserStats(userId: number): Promise<UserStats> {
    const user = await this.getUser(userId);
    if (!user) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        totalTasks: 0,
        perfectDays: 0,
        weekProgress: [0, 0, 0, 0, 0, 0, 0],
        nextMilestone: 7,
      };
    }

    // Calculate week progress (last 7 days)
    const weekProgress: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayHistory = Array.from(this.streakHistory.values())
        .find(entry => entry.userId === userId && entry.date === dateString);
      
      weekProgress.push(dayHistory?.completionRate || 0);
    }

    // Calculate next milestone
    let nextMilestone = 50;
    const milestones = [7, 14, 21, 30, 50, 100, 365];
    for (const milestone of milestones) {
      if (user.currentStreak < milestone) {
        nextMilestone = milestone;
        break;
      }
    }

    return {
      currentStreak: user.currentStreak,
      bestStreak: user.bestStreak,
      totalTasks: user.totalTasks,
      perfectDays: user.perfectDays,
      weekProgress,
      nextMilestone,
    };
  }
}

export const storage = new MemStorage();
