import React from 'react';
import { Priority } from '../types';

interface TaskBreakdownChartProps {
  data: Record<Priority, number>;
}

const COLORS = {
  [Priority.High]: '#ef4444', // theme.colors.danger
  [Priority.Medium]: '#f59e0b', // amber-500
  [Priority.Low]: '#10b981', // theme.colors.accent
};

const priorityLabels = {
  [Priority.High]: 'High',
  [Priority.Medium]: 'Medium',
  [Priority.Low]: 'Low',
};

export const TaskBreakdownChart: React.FC<TaskBreakdownChartProps> = ({ data }) => {
  const priorities = [Priority.High, Priority.Medium, Priority.Low];
  const totalTasks = priorities.reduce((sum, p) => sum + (data[p] || 0), 0);

  if (totalTasks === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">Task Breakdown</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">No tasks this week to display.</p>
      </div>
    );
  }

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg h-48 flex flex-col">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 text-center mb-2">Task Breakdown</p>
      <div className="flex-grow flex items-center justify-around">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)'}}>
            <circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="15" className="text-gray-200 dark:text-gray-600" stroke="currentColor" />
            {priorities.map(p => {
              const count = data[p] || 0;
              if (count === 0) return null;
              
              const percentage = (count / totalTasks) * 100;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const rotation = accumulatedPercentage;
              
              accumulatedPercentage += percentage;

              return (
                <circle
                  key={p}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={COLORS[p]}
                  strokeWidth="15"
                  strokeDasharray={strokeDasharray}
                  style={{ transform: `rotate(${rotation * 3.6}deg)`, transformOrigin: '50% 50%' }}
                />
              );
            })}
          </svg>
        </div>
        <div className="text-xs space-y-1">
          {priorities.map(p => (
            <div key={p} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[p] }}></span>
              <span className="text-gray-600 dark:text-gray-300">{priorityLabels[p]}: {data[p] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
