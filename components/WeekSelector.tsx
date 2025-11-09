import React from 'react';

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

interface WeekSelectorProps {
  currentSelectedWeek: number;
  onSelectWeek: (week: number) => void;
  weekOffset: number;
  onPrevBlock: () => void;
  onNextBlock: () => void;
  activeWeeks: Set<number>;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ currentSelectedWeek, onSelectWeek, weekOffset, onPrevBlock, onNextBlock, activeWeeks }) => {
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1 + weekOffset);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <button 
          onClick={onPrevBlock} 
          disabled={weekOffset === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Prev 12
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">
          Weeks {weekOffset + 1} - {weekOffset + 12}
        </h3>
        <button 
          onClick={onNextBlock}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Next 12
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
        {weeks.map((weekNumber, index) => {
          const weekInBlock = index + 1;
          const isSelected = currentSelectedWeek === weekInBlock;
          const hasTasks = activeWeeks.has(weekNumber);
          return (
            <button
              key={weekNumber}
              onClick={() => onSelectWeek(weekInBlock)}
              className={`
                h-12 rounded-lg flex items-center justify-center font-bold text-sm
                transition-all duration-200 ease-in-out transform hover:scale-105
                ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow-lg scale-110'
                    : hasTasks
                    ? 'bg-brand-light/70 dark:bg-brand-dark/60 text-brand-dark dark:text-brand-light font-semibold'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-brand-secondary/20'
                }
              `}
            >
              {weekNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};