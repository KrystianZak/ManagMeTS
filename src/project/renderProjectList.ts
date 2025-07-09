import { ProjectStorage } from '../storage/ProjectStorage';
import { TaskStorage } from '../storage/TaskStorage';
import { HistoryStorage } from '../storage/HistoryStorage';
import { renderTaskKanban } from '../task/renderTaskKanban';
import { renderHistoryList } from '../history/renderHistoryList';

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
      // Usuń projekt
      ProjectStorage.deleteProject(project.id);

      // Usuń zadania powiązane z tym projektem
      const tasks = TaskStorage.getTasks();
      const updatedTasks = tasks.filter(t => t.projectId !== project.id);
      TaskStorage.saveAll(updatedTasks);

      // Usuń historyjki powiązane z tym projektem
      const stories = HistoryStorage.getStories();
      const updatedStories = stories.filter(s => s.projectId !== project.id);
      HistoryStorage.saveAll(updatedStories);

      // Usuń aktywny projekt jeśli to ten
      const activeId = localStorage.getItem('activeProjectId');
      if (activeId === project.id) {
        localStorage.removeItem('activeProjectId');
      }

      // Odśwież widoki
      renderProjectList(listEl, nameInput, descInput, setEditingId);
      renderTaskKanban(document.querySelector('#kanban-board')!);
      renderHistoryList(
        document.querySelector('#history-list')!,
        document.querySelector('#status-filter')!,
        () => {}
      );
    };

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    listEl.appendChild(li);
  }
}
