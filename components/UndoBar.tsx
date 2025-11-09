
import React, { useEffect, useState } from 'react';
import type { Task } from '../types';

interface UndoBarProps {
  deletedTask: Task | null;
  onUndo: () => void;
}

export const UndoBar: React.FC<UndoBarProps> = ({ deletedTask, onUndo }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (deletedTask) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [deletedTask]);

  if (!deletedTask) return null;

  return (
    <div 
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-lg
        bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800
        p-4 rounded-lg shadow-2xl flex items-center justify-between
        transition-transform duration-300 ease-in-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}
    >
      <p className="flex-grow">
        Deleted "<strong>{deletedTask.name}</strong>"
      </p>
      <button 
        onClick={onUndo}
        className="ml-4 font-bold uppercase text-accent dark:text-brand-primary hover:underline"
      >
        Undo
      </button>
    </div>
  );
};
