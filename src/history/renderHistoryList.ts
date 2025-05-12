import { HistoryStorage } from '../storage/HistoryStorage';
import { ActiveProject } from '../storage/ActiveProject';
import { HistoryStatus } from '../models/History';

export function renderHistoryList(
  historyList: HTMLUListElement,
  filterEl: HTMLSelectElement,
  onEdit: (id: string, name: string, desc: string, priority: string, status: string) => void
) {
  const activeId = ActiveProject.get();
  if (!activeId) {
    historyList.innerHTML = '<li>Nie wybrano aktywnego projektu</li>';
    return;
  }

  let items = HistoryStorage.getByProject(activeId);
  const selectedStatus = filterEl.value as HistoryStatus | 'all';
  if (selectedStatus !== 'all') {
    items = items.filter(i => i.status === selectedStatus);
  }

  historyList.innerHTML = '';
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = `🔸 ${item.name} [${item.priority}] (${item.status}) - ${item.description}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edytuj';
    editBtn.onclick = () => {
      onEdit(item.id, item.name, item.description, item.priority, item.status);
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Usuń';
    delBtn.onclick = () => {
      HistoryStorage.delete(item.id);
      renderHistoryList(historyList, filterEl, onEdit);
    };

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    historyList.appendChild(li);
  }
}
