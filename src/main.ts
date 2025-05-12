import { Project } from './models/Project';
import { ProjectStorage } from './storage/ProjectStorage';

const form = document.querySelector<HTMLFormElement>('#project-form')!;
const nameInput = document.querySelector<HTMLInputElement>('#name')!;
const descInput = document.querySelector<HTMLInputElement>('#description')!;
const list = document.querySelector<HTMLUListElement>('#project-list')!;

let editingProjectId: string | null = null;

const renderProjects = () => {
  list.innerHTML = '';
  const projects = ProjectStorage.getProjects();

  for (const project of projects) {
    const li = document.createElement('li');
    li.textContent = `${project.name} - ${project.description}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Usuń';
    deleteBtn.onclick = () => {
      ProjectStorage.deleteProject(project.id);
      renderProjects();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edytuj';
    editBtn.onclick = () => {
      nameInput.value = project.name;
      descInput.value = project.description;
      editingProjectId = project.id;
    };

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  }
};

form.onsubmit = (e) => {
  e.preventDefault();

  const project: Project = {
    id: editingProjectId ?? Date.now().toString(),
    name: nameInput.value,
    description: descInput.value,
  };

  if (editingProjectId) {
    ProjectStorage.updateProject(project);
  } else {
    ProjectStorage.addProject(project);
  }

  form.reset();
  editingProjectId = null;
  renderProjects();
};

renderProjects();
