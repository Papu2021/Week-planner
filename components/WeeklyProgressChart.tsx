// FIX: Import 'useMemo' from react.
import React, { useMemo } from 'react';
import type { Task } from '../types';

interface WeeklyProgressChartProps {
  allTasks: Task[];
  weekOffset: number;
}

const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ allTasks, weekOffset }) => {
  const weeklyData = useMemo(() => {
    const tasksByWeek: { [week: number]: { total: number; completed: number } } = {};
    
    allTasks.forEach(task => {
        if (!tasksByWeek[task.week]) {
            tasksByWeek[task.week] = { total: 0, completed: 0 };
        }
        tasksByWeek[task.week].total++;
        if (task.completed) {
            tasksByWeek[task.week].completed++;
        }
    });

    const currentBlockWeeks = Array.from({ length: 12 }, (_, i) => i + 1 + weekOffset);

    return currentBlockWeeks.map(week => {
      const data = tasksByWeek[week];
      if (!data || data.total === 0) {
        return { week, percentage: 0 };
      }
      return {
        week,
        percentage: Math.round((data.completed / data.total) * 100),
      }
    });
  }, [allTasks, weekOffset]);

  const hasAnyTasksInBlock = weeklyData.some(d => d.percentage > 0);

  if (!hasAnyTasksInBlock && allTasks.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col items-center justify-center">
        <BarChartIcon />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">Weekly Progress</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">No task data available yet.</p>
    </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 text-center mb-2">Progress for Weeks {weekOffset + 1}-{weekOffset + 12}</p>
      <div className="flex-grow flex items-stretch gap-2">
        <div className="flex flex-col justify-between text-right text-[10px] text-gray-400 dark:text-gray-500 py-1" style={{paddingBottom: '1rem'}}>
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
        </div>
        <div className="relative flex-grow flex items-end justify-around gap-1.5 px-1 border-l border-b border-gray-200 dark:border-gray-600">
            {/* Gridlines */}
            <div className="absolute w-full border-t border-dashed border-gray-300 dark:border-gray-600/50" style={{bottom: 'calc(100% + 0.25rem)'}} />
            <div className="absolute w-full border-t border-dashed border-gray-300 dark:border-gray-600/50" style={{bottom: 'calc(50% + 0.75rem)'}} />

            {weeklyData.map(({ week, percentage }) => (
            <div key={week} className="flex-1 h-full flex flex-col items-center group justify-end" >
                <div className="relative w-full h-full flex items-end">
                <div
                    className="w-full bg-brand-secondary/50 dark:bg-brand-primary/50 rounded-t-sm transition-all duration-300 ease-out group-hover:bg-brand-secondary dark:group-hover:bg-brand-primary"
                    style={{ height: `${percentage || 0}%`}}
                >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-gray-800 rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Wk {week}: {percentage}%
                </div>
                </div>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{week}</span>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};