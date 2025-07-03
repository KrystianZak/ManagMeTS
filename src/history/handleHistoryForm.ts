import { History, Priority, HistoryStatus } from '../models/History';
import { HistoryStorage } from '../storage/HistoryStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { UserManager } from '../storage/UserManager';
import { renderHistoryList } from './renderHistoryList';

export function handleHistoryForm(
  form: HTMLFormElement,
  nameInput: HTMLInputElement,
  descInput: HTMLInputElement,
  prioritySelect: HTMLSelectElement,
  statusSelect: HTMLSelectElement,
  listEl: HTMLUListElement,
  filterEl: HTMLSelectElement,
  getEditingId: () => string | null,
  clearEditingId: () => void,
  onEdit: Parameters<typeof renderHistoryList>[2]
) {
  form.onsubmit = (e) => {
    e.preventDefault();

    const activeId = ActiveProject.get();
    const user = UserManager.getUser();
    if (!activeId || !user) return;

    const newHistory: History = {
      id: getEditingId() ?? Date.now().toString(),
      name: nameInput.value,
      description: descInput.value,
      priority: prioritySelect.value as Priority,
      status: statusSelect.value as HistoryStatus,
      projectId: activeId,
      createdAt: new Date().toISOString(),
      ownerId: user.id
    };

    if (getEditingId()) {
      HistoryStorage.update(newHistory);
    } else {
      HistoryStorage.add(newHistory);
    }

    clearEditingId();
    form.reset();
    renderHistoryList(listEl, filterEl, onEdit); // ← użyj poprawnie przekazanego handlera
  };
}

