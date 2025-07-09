import { Task } from '../models/Task';

const STORAGE_KEY = 'tasks';

export class TaskStorage {
  static getAll(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // ✅ Dodajemy alias getTasks (żeby pasował do istniejącego kodu)
  static getTasks(): Task[] {
    return this.getAll();
  }

  static saveAll(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  static add(task: Task) {
    const tasks = this.getAll();
    tasks.push(task);
    this.saveAll(tasks);
  }

  static update(task: Task) {
    const tasks = this.getAll().map(t => t.id === task.id ? task : t);
    this.saveAll(tasks);
  }

  static delete(id: string) {
    const tasks = this.getAll().filter(t => t.id !== id);
    this.saveAll(tasks);
  }

  static getByHistory(historyId: string): Task[] {
    return this.getAll().filter(t => t.historyId === historyId);
  }

  static getByUser(userId: string): Task[] {
    return this.getAll().filter(t => t.assignedUserId === userId);
  }
  
}
