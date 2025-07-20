import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from "@/lib/date-utils";
import type { StreakHistory } from "@shared/schema";

export default function StreakCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  
  const { data: streakHistory = [] } = useQuery<StreakHistory[]>({
    queryKey: ["/api/streak/history", {
      startDate: formatDate(startOfMonth),
      endDate: formatDate(endOfMonth)
    }],
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const getStreakData = (date: Date) => {
    const dateString = formatDate(date);
    return streakHistory.find(entry => entry.date === dateString);
  };

  const getDayStyle = (day: number) => {
    const date = new Date(year, month, day);
    const dateString = formatDate(date);
    const streakData = getStreakData(date);
    
    // Today
    if (date.toDateString() === today.toDateString()) {
      return "w-8 h-8 text-xs flex items-center justify-center bg-warm-orange text-white rounded-full font-bold";
    }
    
    // Future dates
    if (date > today) {
      return "w-8 h-8 text-xs flex items-center justify-center text-gray-400";
    }
    
    // Past dates with streak data
    if (streakData) {
      if (streakData.isPerfectDay) {
        return "w-8 h-8 text-xs flex items-center justify-center bg-forest text-white rounded-full";
      } else if (streakData.completionRate > 0) {
        return "w-8 h-8 text-xs flex items-center justify-center bg-sage text-white rounded-full";
      }
    }
    
    // Past dates without data
    return "w-8 h-8 text-xs flex items-center justify-center text-gray-400";
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Create calendar grid
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="w-8 h-8"></div>
    );
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <div key={day} className={getDayStyle(day)}>
        {day}
      </div>
    );
  }

  return (
    <Card className="glass-effect rounded-2xl shadow-lg border border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-forest">
            {monthNames[month]} {year}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
            >
              <ChevronLeft className="h-4 w-4 text-sage" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
            >
              <ChevronRight className="h-4 w-4 text-sage" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={`${day}-${index}`} className="text-xs text-sage text-center py-1 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>
        
        <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-forest rounded-full"></div>
            <span className="text-sage">Perfect Day</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-sage rounded-full"></div>
            <span className="text-sage">Partial</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warm-orange rounded-full"></div>
            <span className="text-sage">Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
