
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stat {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

const Stats: React.FC = () => {
  const stats: Stat[] = [
    {
      title: "Posts This Week",
      value: 12,
      change: "+2.5%",
      isPositive: true
    },
    {
      title: "Posts This Month",
      value: 36,
      change: "+4.1%",
      isPositive: true
    },
    {
      title: "Average Views",
      value: "2.4K",
      change: "-0.8%",
      isPositive: false
    },
    {
      title: "Stories Posted",
      value: 86,
      change: "+12.3%",
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change && (
              <p className={`text-xs inline-flex items-center ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="mr-1">{stat.change}</span>
                <span>from last period</span>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Stats;
