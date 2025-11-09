import { useState, useEffect, useCallback, useRef } from 'react';
import type { Task } from '../types';
import { firebaseService } from '../services/firebase';

export const useWeeklyData = (currentWeek: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyDeletedTask, setRecentlyDeletedTask] = useState<Task | null>(null);
  
  const undoTimeoutRef = useRef<number | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [weeklyTasks, allOverallTasks] = await Promise.all([
          firebaseService.getTasksForWeek(currentWeek),
          firebaseService.getAllTasks()
      ]);
      setTasks(weeklyTasks.sort((a, b) => a.name.localeCompare(b.name)));
      setAllTasks(allOverallTasks);
    } catch (e) {
      setError("Failed to fetch tasks.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeek]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTask = async (taskData: Omit<Task, 'id' | 'week' | 'completed'>) => {
    try {
      const newTaskData = { ...taskData, week: currentWeek, completed: false };
      const addedTask = await firebaseService.addTask(newTaskData);
      setTasks(prev => [...prev, addedTask].sort((a, b) => a.name.localeCompare(b.name)));
      setAllTasks(prev => [...prev, addedTask]);
    } catch (e) {
      setError("Failed to add task.");
      console.error(e);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await firebaseService.updateTask(id, updates);
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
      setAllTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    } catch (e) {
      setError("Failed to update task.");
      console.error(e);
    }
  };

  const deleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    // Optimistic UI update
    setTasks(prev => prev.filter(t => t.id !== id));
    setRecentlyDeletedTask(taskToDelete);

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    undoTimeoutRef.current = window.setTimeout(async () => {
      try {
        await firebaseService.deleteTask(id);
        setAllTasks(prev => prev.filter(t => t.id !== id));
      } catch (e) {
        // Revert UI if delete fails
        setTasks(prev => [...prev, taskToDelete].sort((a, b) => a.name.localeCompare(b.name)));
        setError("Failed to delete task. Please try again.");
      } finally {
        setRecentlyDeletedTask(null);
        undoTimeoutRef.current = null;
      }
    }, 6000); // 6 second undo window
  };

  const undoDelete = async () => {
    if (!recentlyDeletedTask) return;
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    setTasks(prev => [...prev, recentlyDeletedTask].sort((a, b) => a.name.localeCompare(b.name)));
    setRecentlyDeletedTask(null);
  };
  
  return { tasks, allTasks, isLoading, error, addTask, updateTask, deleteTask, undoDelete, recentlyDeletedTask };
};