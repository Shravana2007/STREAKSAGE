import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TaskWithCompletion } from "@shared/schema";

interface TaskCardProps {
  task: TaskWithCompletion;
  onComplete?: () => void;
}

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tasks/${task.id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      onComplete?.();
      
      toast({
        title: "Task Completed! 🎉",
        description: `Great job on completing "${task.title}"`,
      });

      // Trigger celebration animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete task",
        variant: "destructive",
      });
    },
  });

  const handleToggle = () => {
    if (!task.isCompletedToday && !completeMutation.isPending) {
      completeMutation.mutate();
    }
  };

  return (
    <Card className="glass-effect rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-warm-orange to-forest rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
            {task.emoji}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-forest mb-1">{task.title}</h4>
            <p className="text-sm text-sage mb-3">{task.description}</p>
            <div className="flex items-center justify-between">
              <Button
                onClick={handleToggle}
                disabled={task.isCompletedToday || completeMutation.isPending}
                className={cn(
                  "w-6 h-6 border-2 border-sage rounded hover:bg-sage hover:border-sage transition-all duration-200 flex items-center justify-center relative",
                  task.isCompletedToday && "bg-sage border-sage",
                  "p-0"
                )}
                size="sm"
                variant="outline"
              >
                <Check 
                  className={cn(
                    "h-3 w-3 text-white transition-all duration-200",
                    task.isCompletedToday ? "opacity-100 animate-check" : "opacity-0"
                  )} 
                />
                {isAnimating && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce pointer-events-none">
                    🎉
                  </div>
                )}
              </Button>
              <span className="text-xs text-sage">
                {task.streak > 0 ? `${task.streak}-day streak 🔥` : "Start your streak!"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
