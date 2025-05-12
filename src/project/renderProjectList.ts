import { ProjectStorage } from '../storage/ProjectStorage';

export function renderProjectList(
  listEl: HTMLUListElement,
  nameInput: HTMLInputElement,
  descInput: HTMLInputElement,
  setEditingId: (id: string | null) => void
) {
  listEl.innerHTML = '';
  const projects = ProjectStorage.getProjects();

  for (const project of projects) {
    const li = document.createElement('li');
    li.textContent = `${project.name} - ${project.description}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edytuj';
    editBtn.onclick = () => {
      nameInput.value = project.name;
      descInput.value = project.description;
      setEditingId(project.id);
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Usuń';
    delBtn.onclick = () => {
      ProjectStorage.deleteProject(project.id);
      renderProjectList(listEl, nameInput, descInput, setEditingId);
    };

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    listEl.appendChild(li);
  }
}
