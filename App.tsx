import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { WeekSelector } from './components/WeekSelector';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { UndoBar } from './components/UndoBar';
import { useWeeklyData } from './hooks/useWeeklyData';
import type { Task } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedWeekInBlock, setSelectedWeekInBlock] = useState(1);

  const currentWeek = selectedWeekInBlock + weekOffset;

  const { 
    tasks, 
    allTasks,
    isLoading, 
    error, 
    addTask, 
    updateTask, 
    deleteTask, 
    undoDelete, 
    recentlyDeletedTask 
  } = useWeeklyData(currentWeek);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleNextBlock = () => setWeekOffset(prev => prev + 12);
  const handlePrevBlock = () => setWeekOffset(prev => Math.max(0, prev - 12));

  const weeklyTasks = useMemo(() => tasks, [tasks]);
  const allOverallTasks = useMemo(() => allTasks, [allTasks]);

  const activeWeeks = useMemo(() => {
    return new Set(allOverallTasks.map(task => task.week));
  }, [allOverallTasks]);

  const weeklyStats = useMemo(() => {
    const total = weeklyTasks.length;
    if (total === 0) return { total: 0, completed: 0, percentage: 0 };
    const completed = weeklyTasks.filter(t => t.completed).length;
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  }, [weeklyTasks]);

  const overallStats = useMemo(() => {
    const total = allOverallTasks.length;
    if (total === 0) return { total: 0, completed: 0, percentage: 0 };
    const completed = allOverallTasks.filter(t => t.completed).length;
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  }, [allOverallTasks]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <WeekSelector 
          currentSelectedWeek={selectedWeekInBlock}
          onSelectWeek={setSelectedWeekInBlock}
          weekOffset={weekOffset}
          onPrevBlock={handlePrevBlock}
          onNextBlock={handleNextBlock}
          activeWeeks={activeWeeks}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">This Week's Progress</p>
            <p className="text-4xl font-bold text-brand-primary dark:text-brand-secondary mt-2">{weeklyStats.percentage}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{weeklyStats.completed} of {weeklyStats.total} tasks</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Progress</p>
            <p className="text-4xl font-bold text-accent mt-2">{overallStats.percentage}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{overallStats.completed} of {overallStats.total} tasks</p>
          </div>
        </div>

        <div className="mt-6">
          <TaskList 
            week={currentWeek} 
            tasks={weeklyTasks} 
            isLoading={isLoading}
            error={error}
            onAddTask={(task) => addTask(task)}
            onUpdateTask={(id, updates) => updateTask(id, updates)}
            onDeleteTask={(id) => deleteTask(id)}
          />
        </div>

        <div className="mt-8">
          <Dashboard 
            weeklyTasks={weeklyTasks} 
            allTasks={allOverallTasks} 
            weekOffset={weekOffset}
          />
        </div>
      </main>
      <UndoBar 
        deletedTask={recentlyDeletedTask}
        onUndo={undoDelete}
      />
    </div>
  );
};

export default App;