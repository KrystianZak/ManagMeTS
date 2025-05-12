import { ActiveProject } from '../storage/ActiveProject';
import { ProjectStorage } from '../storage/ProjectStorage';

export function renderProjectSelector(
  containerId: string,
  onChange: () => void
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const projects = ProjectStorage.getProjects();

  if (projects.length === 0) {
    container.innerHTML = '<p style="color:red;">Brak projektów</p>';
    return;
  }

  const select = document.createElement('select');

  const clearOption = document.createElement('option');
  clearOption.value = '';
  clearOption.textContent = '— Brak aktywnego projektu —';
  select.appendChild(clearOption);

  const activeId = ActiveProject.get();
  for (const project of projects) {
    const opt = document.createElement('option');
    opt.value = project.id;
    opt.textContent = project.name;
    if (project.id === activeId) opt.selected = true;
    select.appendChild(opt);
  }

  select.onchange = () => {
    const id = select.value;
    id ? ActiveProject.set(id) : ActiveProject.clear();
    onChange();
  };

  container.innerHTML = '';
  container.appendChild(select);
}
