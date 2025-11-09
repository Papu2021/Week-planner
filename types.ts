export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Task {
  id: string;
  week: number;
  name: string;
  completed: boolean;
  priority: Priority;
  notes: string;
}