const ACTIVE_PROJECT_KEY = 'activeProjectId';

export class ActiveProject {
  static get(): string | null {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  }

  static set(id: string): void {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }

  static clear(): void {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}
