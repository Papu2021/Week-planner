import React, { useMemo } from 'react';
import type { Task } from '../types';

interface PerformanceTrendChartProps {
  allTasks: Task[];
}

const TrendUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const TrendDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
  </svg>
);

const NoChangeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
    </svg>
);

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ allTasks }) => {
  const trendData = useMemo(() => {
    const tasksByWeek = allTasks.reduce((acc, task) => {
      acc[task.week] = acc[task.week] || { total: 0, completed: 0 };
      acc[task.week].total++;
      if (task.completed) acc[task.week].completed++;
      return acc;
    }, {} as Record<number, { total: number; completed: number }>);
    
    const weeklyProgress = Object.entries(tasksByWeek)
        .map(([weekStr, data]) => ({
            week: parseInt(weekStr),
            percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
        }))
        .sort((a, b) => a.week - b.week);
    
    if (weeklyProgress.length < 1) {
      return { current: null, previous: null, trend: null };
    }

    if (weeklyProgress.length < 2) {
      return { current: weeklyProgress[0], previous: null, trend: null };
    }
    
    const [previous, current] = weeklyProgress.slice(-2);
    
    return {
      current,
      previous,
      trend: current.percentage - previous.percentage
    }
  }, [allTasks]);

  if (!trendData.current) {
    return (
       <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col items-center justify-center text-center">
        <TrendUpIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">Performance Trend</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">No task data available.</p>
      </div>
    );
  }
  
  const TrendIcon = trendData.trend === null || trendData.trend === 0 ? NoChangeIcon : trendData.trend > 0 ? TrendUpIcon : TrendDownIcon;
  const trendColor = trendData.trend === null || trendData.trend === 0 ? 'text-gray-500 dark:text-gray-400' : trendData.trend > 0 ? 'text-accent' : 'text-danger';

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Recent Performance</p>
      <p className="text-5xl font-bold text-brand-primary dark:text-brand-secondary my-2">{trendData.current.percentage}<span className="text-2xl">%</span></p>
      <div className={`flex items-center gap-1 font-semibold ${trendColor}`}>
        <TrendIcon className="h-6 w-6" />
        {trendData.trend !== null && trendData.previous ? (
            <span>{Math.abs(trendData.trend)}% {trendData.trend > 0 ? 'increase' : trendData.trend < 0 ? 'decrease' : 'no change'}</span>
        ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">First week of activity</span>
        )}
      </div>
       {trendData.previous && (
         <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Week {trendData.current.week} vs Week {trendData.previous.week}
         </p>
       )}
    </div>
  );
};