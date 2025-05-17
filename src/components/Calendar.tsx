
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  date: Date;
  platforms: string[];
}

interface CalendarViewProps {
  schedules: ScheduleItem[];
  onScheduleSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ schedules, onScheduleSelect }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onScheduleSelect(newDate);
    }
  };

  // Week view logic
  const startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(date, { weekStartsOn: 0 });
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek
  });

  const dayHasSchedule = (day: Date) => {
    return schedules.some(schedule => isSameDay(day, schedule.date));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className={cn(
              "text-sm",
              view === "week" ? "bg-brand-purple text-white hover:bg-brand-purple/90" : ""
            )}
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button 
            variant="outline"
            className={cn(
              "text-sm",
              view === "month" ? "bg-brand-purple text-white hover:bg-brand-purple/90" : ""
            )}
            onClick={() => setView("month")}
          >
            Month
          </Button>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{format(date, "MMMM yyyy")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="border-0"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {view === "week" && (
        <div className="grid grid-cols-7 gap-2 mt-4">
          {daysOfWeek.map((day) => (
            <div 
              key={day.toString()}
              className={cn(
                "border rounded-md p-2 h-32 cursor-pointer transition-colors",
                isSameDay(day, new Date()) ? "border-brand-purple bg-brand-lightPurple/10" : "",
                dayHasSchedule(day) ? "border-brand-purple" : ""
              )}
              onClick={() => handleDateChange(day)}
            >
              <div className="font-medium text-sm mb-1">{format(day, "EEE")}</div>
              <div className={cn(
                "text-lg",
                isSameDay(day, new Date()) ? "text-brand-purple font-bold" : ""
              )}>
                {format(day, "d")}
              </div>
              
              {dayHasSchedule(day) && (
                <div className="mt-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-brand-purple"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {view === "month" && (
        <div className="border rounded-md p-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="border-0"
          />
        </div>  
      )}
    </div>
  );
};

export default CalendarView;
