import React from 'react';
import type { Task } from '../types';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';

interface TaskListProps {
  week: number;
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onAddTask: (task: Omit<Task, 'id' | 'week' | 'completed'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>
);

export const TaskList: React.FC<TaskListProps> = ({ week, tasks, isLoading, error, onAddTask, onUpdateTask, onDeleteTask }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-brand-dark dark:text-brand-light">Tasks for Week {week}</h2>
      
      <div className="mb-6">
        <AddTaskForm onAddTask={onAddTask} />
      </div>

      {error && <p className="text-center text-danger p-4 bg-danger/10 rounded-md">{error}</p>}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks for this week. Add one above to get started!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={onUpdateTask} 
              onDelete={onDeleteTask} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};