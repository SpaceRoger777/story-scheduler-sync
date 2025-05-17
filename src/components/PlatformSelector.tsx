
import React from 'react';
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const platforms: Platform[] = [
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: <Facebook className="h-5 w-5" />, 
    color: '#1877F2' 
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <Instagram className="h-5 w-5" />, 
    color: '#E1306C' 
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: <Youtube className="h-5 w-5" />, 
    color: '#FF0000' 
  }
];

interface PlatformSelectorProps {
  selected: string[];
  onChange: (platforms: string[]) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  const togglePlatform = (platformId: string) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter(id => id !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Select platforms:</h3>
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <div 
            key={platform.id}
            className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer transition-all ${
              selected.includes(platform.id) 
                ? 'border-brand-purple bg-brand-lightPurple/20' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => togglePlatform(platform.id)}
          >
            <div className="flex items-center">
              <Checkbox 
                id={`platform-${platform.id}`}
                checked={selected.includes(platform.id)}
                onCheckedChange={() => togglePlatform(platform.id)}
              />
              <div className="flex items-center ml-3 space-x-2">
                <span style={{ color: platform.color }}>{platform.icon}</span>
                <Label htmlFor={`platform-${platform.id}`} className="font-medium">
                  {platform.name}
                </Label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
