import { Project } from '../models/Project';

const STORAGE_KEY = 'projects';

export class ProjectStorage {
  static getProjects(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  static addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
  }

  static updateProject(updated: Project): void {
    const projects = this.getProjects().map(p =>
      p.id === updated.id ? updated : p
    );
    this.saveProjects(projects);
  }
}
