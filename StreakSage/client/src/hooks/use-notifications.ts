import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const { toast } = useToast();

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const checkTimeBasedNotifications = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Morning quote notification (6:00 AM)
      if (hour === 6 && minute === 0) {
        if (Notification.permission === "granted") {
          new Notification("Morning Wisdom 🌅", {
            body: "Your daily Bhagavad Gita quote is ready to inspire your day!",
            icon: "/favicon.ico",
          });
        }
        
        toast({
          title: "Morning Wisdom 🌅",
          description: "Your daily Bhagavad Gita quote is ready!",
        });
      }

      // Evening reminder notification (9:30 PM)
      if (hour === 21 && minute === 30) {
        if (Notification.permission === "granted") {
          new Notification("Evening Reflection 🌙", {
            body: "Time to reflect on your day and prepare for tomorrow's growth!",
            icon: "/favicon.ico",
          });
        }
        
        toast({
          title: "Evening Reflection 🌙",
          description: "Time to reflect on your day and prepare for tomorrow's growth!",
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeBasedNotifications, 60000);

    // Check immediately
    checkTimeBasedNotifications();

    return () => clearInterval(interval);
  }, [toast]);
}
