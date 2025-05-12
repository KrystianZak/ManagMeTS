import { User } from '../models/User';

const STORAGE_KEY = 'currentUser';

export class UserManager {
  static getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  static setUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  static clearUser(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
