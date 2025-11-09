
import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '../types';
import { Priority } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const priorityStyles = {
  [Priority.Low]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [Priority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [Priority.High]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);
  
  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };
  
  const handleSave = () => {
    onUpdate(task.id, { 
      name: editedTask.name, 
      priority: editedTask.priority, 
      notes: editedTask.notes 
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <li className="bg-brand-light/20 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm space-y-3">
        <input 
          ref={inputRef}
          type="text" 
          name="name" 
          value={editedTask.name} 
          onChange={handleInputChange} 
          className="w-full bg-white dark:bg-gray-600 p-2 rounded border border-brand-secondary focus:ring-2 focus:ring-brand-primary"
        />
        <textarea 
          name="notes" 
          value={editedTask.notes} 
          onChange={handleInputChange} 
          placeholder="Notes..."
          className="w-full bg-white dark:bg-gray-600 p-2 rounded border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-brand-primary"
          rows={2}
        />
        <select 
          name="priority" 
          value={editedTask.priority} 
          onChange={handleInputChange} 
          className="w-full bg-white dark:bg-gray-600 p-2 rounded border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-brand-primary"
        >
          {Object.values(Priority).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={handleCancel} className="px-4 py-1 rounded bg-gray-500 text-white hover:bg-gray-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-1 rounded bg-brand-secondary text-white hover:bg-brand-primary">Save</button>
        </div>
      </li>
    );
  }

  return (
    <li className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm flex items-start gap-4 transition-shadow hover:shadow-md">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
        className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-secondary focus:ring-brand-primary"
      />
      <div className="flex-1">
        <p className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{task.name}</p>
        {task.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.notes}</p>}
        <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full ${priorityStyles[task.priority]}`}>{task.priority}</span>
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-brand-secondary dark:hover:text-brand-light rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
          <EditIcon className="h-5 w-5" />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-gray-500 hover:text-danger dark:hover:text-danger rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
          <DeleteIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
};
