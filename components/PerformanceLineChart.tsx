import React, { useMemo } from 'react';
import type { Task } from '../types';

interface PerformanceLineChartProps {
  allTasks: Task[];
}

const ActivityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export const PerformanceLineChart: React.FC<PerformanceLineChartProps> = ({ allTasks }) => {
  const activityData = useMemo(() => {
    const completedByWeek: Record<number, number> = {};
    allTasks.forEach(task => {
      if (task.completed) {
        completedByWeek[task.week] = (completedByWeek[task.week] || 0) + 1;
      }
    });

    const activeWeeks = Object.entries(completedByWeek)
      .map(([week, count]) => ({ week: parseInt(week), count }))
      .sort((a, b) => b.week - a.week); // Sort descending to get recent weeks first

    if (activeWeeks.length === 0) {
      return null;
    }
    
    const lastActiveWeek = activeWeeks[0];
    const recentMomentum = activeWeeks.slice(0, 4).reduce((sum, week) => sum + week.count, 0);
    const last4WeeksCount = activeWeeks.slice(0, 4).length;

    return {
        lastActiveWeek,
        recentMomentum,
        last4WeeksCount,
    };
  }, [allTasks]);

  if (!activityData) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col items-center justify-center text-center">
        <ActivityIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">Recent Activity</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">No completed tasks yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col justify-center items-center text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Recent Activity</p>
      
      <div className="space-y-4">
        <div>
            <p className="text-3xl font-bold text-brand-primary dark:text-brand-secondary">
                {activityData.lastActiveWeek.count}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">tasks completed in Week {activityData.lastActiveWeek.week}</p>
        </div>

        <div>
            <p className="text-3xl font-bold text-accent">
                {activityData.recentMomentum}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">tasks in last {activityData.last4WeeksCount} active {activityData.last4WeeksCount === 1 ? 'week' : 'weeks'}</p>
        </div>
      </div>
    </div>
  );
};
