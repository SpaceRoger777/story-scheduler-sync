
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Video } from "lucide-react";

const VideoUploader = ({ onVideoSelect }: { onVideoSelect: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Error",
        description: "Please select a video file.",
        variant: "destructive"
      });
      return;
    }
    
    setVideoPreview(URL.createObjectURL(file));
    onVideoSelect(file);
    
    toast({
      title: "Success",
      description: "Video uploaded successfully!",
    });
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? 'border-brand-purple bg-brand-lightPurple/20' : 'border-gray-300 hover:border-brand-purple'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {videoPreview ? (
          <div className="w-full">
            <video 
              src={videoPreview} 
              className="w-full max-h-60 object-contain rounded-lg" 
              controls
            />
            <p className="text-sm text-gray-500 mt-2 text-center">Click or drag to replace video</p>
          </div>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-brand-lightPurple flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-brand-purple" />
            </div>
            <p className="text-gray-600 font-medium mb-1">Upload your video</p>
            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
            <p className="text-xs text-gray-400 mt-2">MP4, MOV, or WebM formats (Max: 100MB)</p>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default VideoUploader;
