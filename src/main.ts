import { setupMockUser } from './user/mockUser';
import { renderUserInfo } from './user/renderUserInfo';

import { renderProjectList } from './project/renderProjectList';
import { handleProjectForm } from './project/handleProjectForm';
import { renderProjectSelector } from './project/renderProjectSelector';

import { renderHistoryList } from './history/renderHistoryList';
import { handleHistoryForm } from './history/handleHistoryForm';

import { handleTaskForm } from './task/handleTaskForm';
import { renderTaskKanban } from './task/renderTaskKanban';

import { ProjectStorage } from './storage/ProjectStorage';
import { TaskStorage } from './storage/TaskStorage';

// Przekierowanie po logowaniu
if (!localStorage.getItem('token')) {
  window.location.href = '/login.html';
}

// Przycisk wyloguj
const logoutButton = document.querySelector<HTMLButtonElement>('#logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login.html';
  });
}

// Przycisk do zmiany motywu
const themeToggle = document.querySelector<HTMLButtonElement>('#toggle-theme');
if (themeToggle) {
  const setTheme = (theme: string) => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme); 
  };

  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme ?? 'light');

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); 
  });
}

// Zmienne do edycji projektów i historyjek
let editingProjectId: string | null = null;
let editingHistoryId: string | null = null;

// DOM elementy (projekty)
const projectList = document.querySelector<HTMLUListElement>('#project-list')!;
const projectNameInput = document.querySelector<HTMLInputElement>('#name')!;
const projectDescInput = document.querySelector<HTMLInputElement>('#description')!;
const projectForm = document.querySelector<HTMLFormElement>('#project-form')!;

// DOM elementy (historyjki)
const historyForm = document.querySelector<HTMLFormElement>('#history-form')!;
const historyName = document.querySelector<HTMLInputElement>('#history-name')!;
const historyDesc = document.querySelector<HTMLInputElement>('#history-description')!;
const historyPriority = document.querySelector<HTMLSelectElement>('#history-priority')!;
const historyStatus = document.querySelector<HTMLSelectElement>('#history-status')!;
const historyList = document.querySelector<HTMLUListElement>('#history-list')!;
const historyFilter = document.querySelector<HTMLSelectElement>('#status-filter')!;

// DOM elementy (zadania)
const taskForm = document.querySelector<HTMLFormElement>('#task-form')!;
const taskName = document.querySelector<HTMLInputElement>('#task-name')!;
const taskDescription = document.querySelector<HTMLInputElement>('#task-description')!;
const taskPriority = document.querySelector<HTMLSelectElement>('#task-priority')!;
const taskStatus = document.querySelector<HTMLSelectElement>('#task-status')!;
const taskEstimated = document.querySelector<HTMLInputElement>('#task-estimated')!;
const taskUser = document.querySelector<HTMLSelectElement>('#task-user')!;
const taskList = document.querySelector<HTMLUListElement>('#task-list')!;

// DOM kanban
const kanbanContainer = document.querySelector<HTMLDivElement>('#kanban-board')!;

// Mock user i info
setupMockUser();
renderUserInfo();

// Lista projektów
renderProjectList(projectList, projectNameInput, projectDescInput, id => editingProjectId = id);

// Formularz projektów
handleProjectForm(
  projectForm,
  projectNameInput,
  projectDescInput,
  projectList,
  () => editingProjectId,
  () => editingProjectId = null
);

// Dropdown aktywnego projektu
renderProjectSelector('active-project-selector', () => {
  renderUserInfo();

  // Czyszczenie zadań osieroconych tylko gdy projektów nie ma lub się nie zgadzają
  const existingProjectIds = ProjectStorage.getProjects().map(p => p.id);
  const activeProjectId = localStorage.getItem('activeProjectId');
  const tasks = TaskStorage.getTasks();
  const validTasks = tasks.filter(task =>
    existingProjectIds.includes(task.projectId) || task.projectId === activeProjectId
  );
  if (tasks.length !== validTasks.length) {
    TaskStorage.saveAll(validTasks);
  }

  // Odśwież dane widoków
  renderHistoryList(historyList, historyFilter, (id, name, desc, priority, status) => {
    editingHistoryId = id;
    historyName.value = name;
    historyDesc.value = desc;
    historyPriority.value = priority;
    historyStatus.value = status;
  });

  renderTaskKanban(kanbanContainer);

  // ponowna rejestracja obsługi formularza zadań
  handleTaskForm(
    taskForm,
    taskName,
    taskDescription,
    taskPriority,
    taskEstimated,
    taskUser,
    taskStatus,
    taskList,
    () => renderTaskKanban(kanbanContainer)
  );
});

// Lista historyjek
renderHistoryList(historyList, historyFilter, (id, name, desc, priority, status) => {
  editingHistoryId = id;
  historyName.value = name;
  historyDesc.value = desc;
  historyPriority.value = priority;
  historyStatus.value = status;
});

// Formularz historyjek
handleHistoryForm(
  historyForm,
  historyName,
  historyDesc,
  historyPriority,
  historyStatus,
  historyList,
  historyFilter,
  () => editingHistoryId,
  () => editingHistoryId = null,
  (id, name, desc, priority, status) => {
    editingHistoryId = id;
    historyName.value = name;
    historyDesc.value = desc;
    historyPriority.value = priority;
    historyStatus.value = status;
  }
);

// Filtrowanie historyjek po statusie
historyFilter.onchange = () => {
  renderHistoryList(historyList, historyFilter, (id, name, desc, priority, status) => {
    editingHistoryId = id;
    historyName.value = name;
    historyDesc.value = desc;
    historyPriority.value = priority as string;
    historyStatus.value = status as string;
  });
};

// Inicjalna rejestracja formularza zadań (przed zmianą projektu)
handleTaskForm(
  taskForm,
  taskName,
  taskDescription,
  taskPriority,
  taskEstimated,
  taskUser,
  taskStatus,
  taskList,
  () => renderTaskKanban(kanbanContainer)
);

// Renderuj Kanban na starcie
renderTaskKanban(kanbanContainer);
