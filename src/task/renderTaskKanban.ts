import type { Task } from '../models/Task';
import { TaskStorage as TaskManager } from '../storage/TaskStorage';
import { mockUsers } from '../user/mockUserList';
import { ActiveProject } from '../storage/ActiveProject';

export function getUserById(id?: string) {
  return mockUsers.find(u => u.id === id);
}

export function renderTaskKanban(container: HTMLElement) {
  container.innerHTML = ''; // wyczyść poprzednią zawartość

  const activeProjectId = ActiveProject.get();
  if (!activeProjectId) return; // jeśli nie ma aktywnego projektu, nic nie renderuj

  const statuses: Array<'todo' | 'doing' | 'done'> = ['todo', 'doing', 'done'];
  const statusLabels = {
    todo: '📌 Do zrobienia',
    doing: '🚧 W trakcie',
    done: '✅ Zrobione'
  };

  statuses.forEach(status => {
    const column = document.createElement('div');
    column.className = 'flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-md';

    const title = document.createElement('h3');
    title.className = 'text-lg font-bold mb-2 text-center';
    title.innerText = statusLabels[status];

    const tasks = TaskManager.getTasks().filter((t: Task) =>
      t.status === status && t.projectId === activeProjectId
    );

    const list = document.createElement('ul');
    list.className = 'space-y-2';

    tasks.forEach((task: Task) => {
      const user = getUserById(task.assignedUserId);
      const li = document.createElement('li');
      li.className = 'p-2 bg-white dark:bg-gray-700 rounded shadow text-sm';
      li.innerHTML = `
        <strong>${task.name}</strong><br/>
        ${task.description}<br/>
        👤 ${user ? user.firstName + ' ' + user.lastName : 'nieprzypisany'}
      `;
      list.appendChild(li);
    });

    column.appendChild(title);
    column.appendChild(list);
    container.appendChild(column);
  });
}
