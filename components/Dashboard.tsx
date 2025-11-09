import React, { useMemo } from 'react';
import type { Task } from '../types';
import { PerformanceLineChart } from './PerformanceLineChart';
import { PerformanceTrendChart } from './PerformanceTrendChart';
import { TaskBreakdownChart } from './TaskBreakdownChart';
import { WeeklyProgressChart } from './WeeklyProgressChart';
import { Priority } from '../types';

interface DashboardProps {
  weeklyTasks: Task[];
  allTasks: Task[];
  weekOffset: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ weeklyTasks, allTasks, weekOffset }) => {
  const priorityBreakdown = useMemo(() => {
    return weeklyTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {} as Record<Priority, number>);
  }, [weeklyTasks]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light">Analytics &amp; Trends</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklyProgressChart allTasks={allTasks} weekOffset={weekOffset} />
        <TaskBreakdownChart data={priorityBreakdown} />
        <PerformanceLineChart allTasks={allTasks} />
        <PerformanceTrendChart allTasks={allTasks} />
      </div>
    </div>
  );
};