import { Project } from '../models/Project';
import { ProjectStorage } from '../storage/ProjectStorage';
import { renderProjectList } from './renderProjectList';

export function handleProjectForm(
  form: HTMLFormElement,
  nameInput: HTMLInputElement,
  descInput: HTMLInputElement,
  listEl: HTMLUListElement,
  getEditingId: () => string | null,
  clearEditingId: () => void
) {
  form.onsubmit = (e) => {
    e.preventDefault();

    const id = getEditingId() ?? Date.now().toString();

    const project: Project = {
      id,
      name: nameInput.value,
      description: descInput.value,
    };

    if (getEditingId()) {
      ProjectStorage.updateProject(project);
    } else {
      ProjectStorage.addProject(project);
    }

    form.reset();
    clearEditingId();
    renderProjectList(listEl, nameInput, descInput, clearEditingId);
  };
}
