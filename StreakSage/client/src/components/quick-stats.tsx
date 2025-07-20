import { Card, CardContent } from "@/components/ui/card";
import type { UserStats } from "@shared/schema";

interface QuickStatsProps {
  stats?: UserStats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  if (!stats) {
    return (
      <Card className="glass-effect rounded-2xl shadow-lg border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-forest mb-4">Motivation Fuel ⚡</h3>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMomentum = () => {
    if (stats.currentStreak >= 21) return "🔥 Unstoppable";
    if (stats.currentStreak >= 14) return "🔥 Strong";
    if (stats.currentStreak >= 7) return "⚡ Growing";
    if (stats.currentStreak >= 3) return "🌱 Building";
    return "🌟 Starting";
  };

  const getAchievement = () => {
    if (stats.currentStreak >= 100) return { title: "Century Club! 💯", desc: "100+ day streak master" };
    if (stats.currentStreak >= 50) return { title: "Golden Streak! 🥇", desc: "50+ days of excellence" };
    if (stats.currentStreak >= 30) return { title: "Monthly Master! 📅", desc: "30+ days of consistency" };
    if (stats.currentStreak >= 21) return { title: "Habit Builder! 🏗️", desc: "3+ weeks of growth" };
    if (stats.currentStreak >= 14) return { title: "Two Week Wonder! ⭐", desc: "2+ weeks of progress" };
    if (stats.currentStreak >= 7) return { title: "Week Warrior! 💪", desc: "1+ week of dedication" };
    return { title: "Journey Beginner! 🌟", desc: "Starting your transformation" };
  };

  const achievement = getAchievement();

  return (
    <Card className="glass-effect rounded-2xl shadow-lg border border-white/20">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-forest mb-4">Motivation Fuel ⚡</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tasks Completed</span>
            <span className="font-semibold text-forest">{stats.totalTasks.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Perfect Days</span>
            <span className="font-semibold text-forest">{stats.perfectDays}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Momentum</span>
            <span className="font-semibold text-warm-orange">{getMomentum()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Next Milestone</span>
            <span className="font-semibold text-sage">{stats.nextMilestone} days</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-warm-orange/20 to-forest/20 rounded-lg">
          <div className="text-sm font-medium text-forest mb-1">{achievement.title}</div>
          <div className="text-xs text-sage">{achievement.desc}</div>
        </div>
      </CardContent>
    </Card>
  );
}
