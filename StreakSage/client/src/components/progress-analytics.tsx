import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { UserStats } from "@shared/schema";

export default function ProgressAnalytics() {
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  if (!stats) {
    return (
      <Card className="glass-effect rounded-2xl shadow-lg border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-forest mb-6">Your Growth Journey 📈</h3>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate today's completion rate
  const today = new Date();
  const todayProgress = stats.weekProgress[6] || 0; // Last item is today

  // Calculate week completion
  const weekDaysCompleted = stats.weekProgress.filter(day => day >= 80).length;

  return (
    <Card className="glass-effect rounded-2xl shadow-lg border border-white/20">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-forest mb-6">Your Growth Journey 📈</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Today's Progress Circle */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="var(--forest)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - todayProgress / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-forest">{todayProgress}%</span>
              </div>
            </div>
            <div className="text-sm text-sage">Today's Progress</div>
          </div>

          {/* Week Progress */}
          <div className="text-center">
            <div className="text-3xl font-bold text-forest mb-2">{weekDaysCompleted}</div>
            <div className="text-sm text-sage">Days This Week</div>
            <div className="flex justify-center space-x-1 mt-2">
              {stats.weekProgress.map((progress, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    progress >= 80 ? 'bg-forest' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Best Streak */}
          <div className="text-center">
            <div className="text-3xl font-bold text-forest mb-2">{stats.bestStreak}</div>
            <div className="text-sm text-sage">Best Streak Ever</div>
            <div className="text-xs text-sage mt-1">🏆 Personal Record</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
