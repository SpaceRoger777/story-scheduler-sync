
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import VideoUploader from "./VideoUploader";
import PlatformSelector from "./PlatformSelector";

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, onClose, defaultDate }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['instagram']);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(defaultDate || new Date());
  const [scheduledTime, setScheduledTime] = useState<string>("12:00");
  
  const handleSubmit = () => {
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

    // In a real app, you would send this data to your backend
    console.log({
      video: videoFile,
      caption,
      platforms,
      scheduledDate,
      scheduledTime
    });
    
    toast({
      title: "Success",
      description: "Your post has been scheduled!",
    });
    
    onClose();
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-brand-purple hover:bg-brand-darkPurple">
            Schedule Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
