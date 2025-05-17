
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import VideoUploader from "./VideoUploader";
import PlatformSelector from "./PlatformSelector";

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

type RecurrencePattern = 'daily' | 'weekly' | 'custom';

const CreatePost: React.FC<CreatePostProps> = ({ open, onClose, defaultDate }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['instagram']);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(defaultDate || new Date());
  const [scheduledTime, setScheduledTime] = useState<string>("12:00");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'wednesday', 'friday']);
  const [isLoading, setIsLoading] = useState(false);
  
  // Days of week options
  const daysOfWeek = [
    { value: 'monday', label: 'Mo' },
    { value: 'tuesday', label: 'Tu' },
    { value: 'wednesday', label: 'We' },
    { value: 'thursday', label: 'Th' },
    { value: 'friday', label: 'Fr' },
    { value: 'saturday', label: 'Sa' },
    { value: 'sunday', label: 'Su' },
  ];
  
  const handleSubmit = async () => {
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please upload a video.",
        variant: "destructive"
      });
      return;
    }
    
    if (platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive"
      });
      return;
    }
    
    // Get webhook URL from localStorage
    const webhookUrl = localStorage.getItem('webhookUrl');
    
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "You need to set up the webhook URL in settings before posting.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare form data for webhook
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('caption', caption);
      formData.append('platforms', JSON.stringify(platforms));
      formData.append('scheduledDate', scheduledDate ? scheduledDate.toISOString() : '');
      formData.append('scheduledTime', scheduledTime);
      formData.append('isRecurring', String(isRecurring));
      
      if (isRecurring) {
        formData.append('recurrencePattern', recurrencePattern);
        if (recurrencePattern === 'custom') {
          formData.append('selectedDays', JSON.stringify(selectedDays));
        }
      }

      // Send data to webhook
      // In a real implementation, you would send this to the webhook URL
      console.log("Sending data to webhook:", webhookUrl, {
        video: videoFile,
        caption,
        platforms,
        scheduledDate,
        scheduledTime,
        isRecurring,
        recurrencePattern,
        selectedDays: recurrencePattern === 'custom' ? selectedDays : undefined
      });
      
      // Mock sending data to webhook
      // Normally, you would use fetch or axios here
      // For example:
      // await fetch(webhookUrl, {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Simulate a delay for the purpose of this example
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: isRecurring 
          ? "Your recurring stories have been scheduled!" 
          : "Your story has been scheduled!",
      });
      
      onClose();
    } catch (error) {
      console.error("Error scheduling post:", error);
      toast({
        title: "Error",
        description: "Failed to schedule your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Story</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <VideoUploader onVideoSelect={(file) => setVideoFile(file)} />
          
          <div className="space-y-2">
            <label htmlFor="caption" className="text-sm font-medium text-gray-700">
              Caption (optional)
            </label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your story..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <PlatformSelector
            selected={platforms}
            onChange={setPlatforms}
          />
          
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Scheduling</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Schedule Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Schedule Time
                </label>
                <input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md h-10 px-3"
                />
              </div>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-gray-500" />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                    Recurring Schedule
                  </label>
                </div>
                <Switch 
                  id="recurring" 
                  checked={isRecurring} 
                  onCheckedChange={setIsRecurring}
                />
              </div>
              
              {isRecurring && (
                <div className="space-y-4 pl-6 border-l-2 border-gray-100">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Recurrence Pattern
                    </label>
                    <ToggleGroup 
                      type="single" 
                      value={recurrencePattern}
                      onValueChange={(value) => {
                        if (value) setRecurrencePattern(value as RecurrencePattern);
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                      <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                      <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  
                  {recurrencePattern === 'custom' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Select Days
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {daysOfWeek.map((day) => (
                          <Button
                            key={day.value}
                            type="button"
                            variant={selectedDays.includes(day.value) ? "default" : "outline"}
                            className={cn(
                              "h-8 w-8 p-0",
                              selectedDays.includes(day.value) ? "bg-brand-purple" : ""
                            )}
                            onClick={() => {
                              setSelectedDays((prev) =>
                                prev.includes(day.value)
                                  ? prev.filter((d) => d !== day.value)
                                  : [...prev, day.value]
                              );
                            }}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-brand-purple hover:bg-brand-darkPurple"
            disabled={isLoading}
          >
            {isLoading ? "Scheduling..." : isRecurring ? "Schedule Stories" : "Schedule Story"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
