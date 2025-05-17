
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";
import CalendarView from "@/components/Calendar";
import CreatePost from "@/components/CreatePost";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduledPost {
  id: string;
  date: Date;
  platforms: string[];
  status: 'scheduled' | 'published' | 'failed';
}

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Dummy data for scheduled posts
  const [scheduledPosts] = useState<ScheduledPost[]>([
    { 
      id: '1', 
      date: new Date(2025, 4, 18, 14, 30), 
      platforms: ['instagram', 'facebook'], 
      status: 'scheduled' 
    },
    { 
      id: '2', 
      date: new Date(2025, 4, 20, 9, 0), 
      platforms: ['youtube'], 
      status: 'scheduled' 
    },
    { 
      id: '3', 
      date: new Date(2025, 4, 15, 17, 15), 
      platforms: ['instagram'], 
      status: 'published' 
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container max-w-7xl px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Story Scheduler</h1>
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-brand-purple hover:bg-brand-darkPurple flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Story
          </Button>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <Stats />
        </div>
        
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <CalendarView 
                schedules={scheduledPosts}
                onScheduleSelect={(date) => {
                  setSelectedDate(date);
                  setIsCreateModalOpen(true);
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium mb-4">Upcoming Posts</h3>
              
              {scheduledPosts
                .filter(post => post.status === 'scheduled')
                .map(post => (
                <div key={post.id} className="flex items-center justify-between border-b py-4">
                  <div>
                    <p className="font-medium">Story for {post.platforms.join(', ')}</p>
                    <p className="text-sm text-gray-500">
                      Scheduled for {format(post.date, 'MMM d, yyyy')} at {format(post.date, 'h:mm a')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
              
              {scheduledPosts.filter(post => post.status === 'scheduled').length === 0 && (
                <p className="text-center text-gray-500 py-8">No upcoming posts scheduled</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="published" className="animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium mb-4">Published Posts</h3>
              
              {scheduledPosts
                .filter(post => post.status === 'published')
                .map(post => (
                <div key={post.id} className="flex items-center justify-between border-b py-4">
                  <div>
                    <p className="font-medium">Story on {post.platforms.join(', ')}</p>
                    <p className="text-sm text-gray-500">
                      Published on {format(post.date, 'MMM d, yyyy')} at {format(post.date, 'h:mm a')}
                    </p>
                  </div>
                  <div className="text-sm text-green-600 font-medium">Published</div>
                </div>
              ))}
              
              {scheduledPosts.filter(post => post.status === 'published').length === 0 && (
                <p className="text-center text-gray-500 py-8">No published posts yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <CreatePost 
        open={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDate(null);
        }}
        defaultDate={selectedDate || undefined}
      />
    </div>
  );
};

export default Index;
