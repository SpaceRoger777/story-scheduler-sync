
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-brand-purple">StoryScheduler</span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-brand-purple font-medium">Dashboard</Link>
          <Link to="/calendar" className="text-gray-600 hover:text-brand-purple font-medium">Calendar</Link>
          <Link to="/analytics" className="text-gray-600 hover:text-brand-purple font-medium">Analytics</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="hidden md:flex border-brand-purple text-brand-purple hover:bg-brand-lightPurple">
          Upgrade to Premium
        </Button>
        <div className="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
          <span className="font-medium text-gray-700">LP</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
