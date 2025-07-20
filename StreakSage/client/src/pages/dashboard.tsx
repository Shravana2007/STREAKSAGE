import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Flame, User } from "lucide-react";
import MorningQuote from "@/components/morning-quote";
import TaskCard from "@/components/task-card";
import StreakCalendar from "@/components/streak-calendar";
import ProgressAnalytics from "@/components/progress-analytics";
import ReflectionNotes from "@/components/reflection-notes";
import EveningReminder from "@/components/evening-reminder";
import QuickStats from "@/components/quick-stats";
import { useNotifications } from "@/hooks/use-notifications";
import type { TaskWithCompletion, User as UserType, UserStats } from "@shared/schema";

export default function Dashboard() {
  const [isWeekend, setIsWeekend] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useNotifications();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine if it's weekend
  useEffect(() => {
    const day = currentTime.getDay();
    setIsWeekend(day === 0 || day === 6);
  }, [currentTime]);

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
  });

  const { data: tasks = [], refetch: refetchTasks } = useQuery<TaskWithCompletion[]>({
    queryKey: ["/api/tasks"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  const handleTaskComplete = () => {
    refetchTasks();
  };

  const isMorningQuoteTime = currentTime.getHours() === 6;
  const isEveningReminderTime = currentTime.getHours() === 21 && currentTime.getMinutes() >= 30;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
                <Flame className="text-warm-orange h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-forest">Streak Prompt</h1>
                <p className="text-sm text-sage">Your Daily Accountability Buddy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-forest">{user?.currentStreak || 0}</div>
                <div className="text-xs text-sage">Day Streak</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-warm-orange to-forest rounded-full flex items-center justify-center">
                <User className="text-white h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Morning Quote */}
            <MorningQuote highlighted={isMorningQuoteTime} />

            {/* Task Categories */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-forest">Today's Journey</h2>
                <div className="flex bg-white rounded-lg p-1 shadow-sm">
                  <Button
                    variant={!isWeekend ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsWeekend(false)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      !isWeekend 
                        ? "bg-forest text-white hover:bg-sage" 
                        : "text-sage hover:bg-gray-50"
                    }`}
                  >
                    Weekday 📅
                  </Button>
                  <Button
                    variant={isWeekend ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsWeekend(true)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      isWeekend 
                        ? "bg-forest text-white hover:bg-sage" 
                        : "text-sage hover:bg-gray-50"
                    }`}
                  >
                    Weekend 🏡
                  </Button>
                </div>
              </div>

              {/* Task Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tasks
                  .filter(task => task.isWeekend === isWeekend)
                  .map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onComplete={handleTaskComplete}
                    />
                  ))}
              </div>
            </div>

            {/* Progress Analytics */}
            <ProgressAnalytics />

            {/* Evening Reminder */}
            {isEveningReminderTime && (
              <EveningReminder tasks={tasks} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Calendar Widget */}
            <StreakCalendar />

            {/* Reflection Notes */}
            <ReflectionNotes />

            {/* Quick Stats */}
            <QuickStats stats={stats} />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          className="w-14 h-14 bg-gradient-to-br from-warm-orange to-forest rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          size="sm"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-warm-orange/10 rounded-full animate-float" style={{animationDelay: '-2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-forest/5 rounded-full animate-float" style={{animationDelay: '-4s'}}></div>
      </div>
    </div>
  );
}
