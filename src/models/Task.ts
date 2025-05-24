import { Priority } from './History';
import { UserRole } from './User';

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  historyId: string;

  estimatedTime: number; // przewidywany czas wykonania w godzinach

  status: TaskStatus;
  createdAt: string;

  startDate?: string; // ustawiane przy zmianie statusu na 'doing'
  endDate?: string;   // ustawiane przy zmianie statusu na 'done'

  assignedUserId?: string; // tylko devops lub developer
}
