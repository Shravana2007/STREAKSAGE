import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/date-utils";
import type { Reflection } from "@shared/schema";

export default function ReflectionNotes() {
  const [content, setContent] = useState("");
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = formatDate(new Date());

  const { data: reflection } = useQuery<Reflection>({
    queryKey: ["/api/reflections", today],
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async (reflectionContent: string) => {
      await apiRequest("POST", "/api/reflections", {
        content: reflectionContent,
        date: today,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reflections", today] });
      setIsAutoSaved(true);
      setTimeout(() => setIsAutoSaved(false), 2000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save reflection",
        variant: "destructive",
      });
    },
  });

  // Load existing reflection
  useEffect(() => {
    if (reflection) {
      setContent(reflection.content);
    }
  }, [reflection]);

  // Auto-save functionality
  useEffect(() => {
    if (content && content !== reflection?.content) {
      const timer = setTimeout(() => {
        saveMutation.mutate(content);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [content, reflection?.content]);

  const handleSave = () => {
    if (content.trim()) {
      saveMutation.mutate(content);
      toast({
        title: "Reflection Saved",
        description: "Your daily reflection has been saved.",
      });
    }
  };

  return (
    <Card className="glass-effect rounded-2xl shadow-lg border border-white/20">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-forest mb-4">Daily Reflection 📔</h3>
        <Textarea
          placeholder="How are you feeling today? What did you learn? What are you grateful for?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-sage focus:border-transparent bg-white/70 text-sm"
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-sage">
            {saveMutation.isPending 
              ? "Saving..." 
              : isAutoSaved 
                ? "Auto-saved" 
                : content !== reflection?.content && content.trim()
                  ? "Unsaved changes"
                  : ""
            }
          </span>
          <Button
            onClick={handleSave}
            disabled={!content.trim() || saveMutation.isPending}
            className="px-4 py-2 bg-forest text-white rounded-lg text-sm hover:bg-sage transition-colors"
            size="sm"
          >
            Save Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
