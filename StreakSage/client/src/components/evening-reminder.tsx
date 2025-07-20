import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import type { TaskWithCompletion } from "@shared/schema";

interface EveningReminderProps {
  tasks: TaskWithCompletion[];
}

export default function EveningReminder({ tasks }: EveningReminderProps) {
  const completedTasks = tasks.filter(task => task.isCompletedToday).length;
  const totalTasks = tasks.length;
  
  const getMessage = () => {
    const ratio = totalTasks > 0 ? completedTasks / totalTasks : 0;
    
    if (ratio === 1) {
      return "Perfect day! You've completed all your tasks. Your dedication is truly inspiring. Rest well and carry this momentum into tomorrow. 🌟";
    } else if (ratio >= 0.75) {
      return `Amazing work today! You've completed ${completedTasks} out of ${totalTasks} tasks. You're building incredible momentum. Rest well and let tomorrow be another opportunity to grow. 🌟`;
    } else if (ratio >= 0.5) {
      return `Good progress today! You've completed ${completedTasks} out of ${totalTasks} tasks. Every step forward is progress, no matter how small. Rest well and trust the process. 🌟`;
    } else {
      return `You've completed ${completedTasks} out of ${totalTasks} tasks today. Remember, progress isn't always perfect, and that's okay. Tomorrow is a fresh start to grow stronger. 🌟`;
    }
  };

  return (
    <Card className="glass-effect rounded-2xl shadow-lg border border-white/20 bg-gradient-to-r from-purple-100 to-blue-100">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Moon className="text-white h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-forest">Evening Reflection 🌙</h3>
              <span className="text-sm text-sage">9:30 PM Reminder</span>
            </div>
            <p className="text-gray-700 mb-3">
              {getMessage()}
            </p>
            <Button 
              variant="link" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium p-0"
            >
              Mark as acknowledged →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
