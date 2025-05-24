import { Task, TaskStatus } from '../models/Task';
import { mockUsers } from '../user/mockUserList';
import { TaskStorage } from '../storage/TaskStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { HistoryStorage } from '../storage/HistoryStorage';
import { UserManager } from '../storage/UserManager';

export function handleTaskForm(
    form: HTMLFormElement,
    name: HTMLInputElement,
    description: HTMLInputElement,
    priority: HTMLSelectElement,
    estimated: HTMLInputElement,
    userSelect: HTMLSelectElement,
    list: HTMLUListElement
) {
    // Wypełnij select użytkowników (devops i developer)
    mockUsers
        .filter(u => u.role !== 'admin')
        .forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.firstName} (${user.role})`;
            userSelect.appendChild(option);
        });

    form.onsubmit = (e) => {
        e.preventDefault();

        const activeProjectId = ActiveProject.get();
        const activeUser = UserManager.getUser();

        if (!activeProjectId || !activeUser) return;

        const histories = HistoryStorage.getByProject(activeProjectId);
        if (histories.length === 0) return;

        const activeHistory = histories[0];

        const task: Task = {
            id: Date.now().toString(),
            name: name.value,
            description: description.value,
            priority: priority.value as Task['priority'],
            historyId: activeHistory.id,
            estimatedTime: parseInt(estimated.value),
            status: 'todo',
            createdAt: new Date().toISOString(),
            assignedUserId: userSelect.value || ''
        };

        TaskStorage.add(task);
        form.reset();
        render(list);
    };

    // Renderowanie zadań dla aktywnej historyjki
    const render = (list: HTMLUListElement) => {
        list.innerHTML = '';
        const tasks = TaskStorage.getAll();

        const activeProjectId = ActiveProject.get();
        if (!activeProjectId) return; // 🔐 zabezpieczenie

        const histories = HistoryStorage.getByProject(activeProjectId);
        if (histories.length === 0) return;

        const history = histories[0];
        const filtered = tasks.filter(t => t.historyId === history.id);

        for (const task of filtered) {
            const li = document.createElement('li');
            const assignedUser = mockUsers.find(u => u.id === task.assignedUserId);
            const userInfo = assignedUser ? `${assignedUser.firstName} (${assignedUser.role})` : 'Nieprzypisany';
            li.textContent = `${task.name} [${task.priority}] – ${task.status} | 🕒 ${task.estimatedTime}h | 👤 ${userInfo}`;
            list.appendChild(li);
        }
    };


    render(list);
}
