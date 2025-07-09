import { History } from '../models/History';

const STORAGE_KEY = 'historyItems';

export class HistoryStorage {
  static getAll(): History[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getByProject(projectId: string): History[] {
    return this.getAll().filter(h => h.projectId === projectId);
  }

  static add(history: History): void {
    const all = this.getAll();
    all.push(history);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  static update(updated: History): void {
    const all = this.getAll().map(h => h.id === updated.id ? updated : h);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  static delete(id: string): void {
    const all = this.getAll().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  // dodane dla renderProjectList:
  static getStories(): History[] {
    return this.getAll();
  }

  static saveAll(stories: History[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }
}
