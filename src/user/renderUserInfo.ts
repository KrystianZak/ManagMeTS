import { UserManager } from '../storage/UserManager';

export function renderUserInfo() {
  const user = UserManager.getUser();
  const info = document.getElementById('user-info');
  if (user && info) {
    info.textContent = `👤 Zalogowany jako: ${user.firstName} ${user.lastName}`;
  }
}