import { UserManager } from '../storage/UserManager';
import { mockUsers } from './mockUserList';

export function setupMockUser() {
  const currentUser = mockUsers.find(u => u.role === 'admin');
  if (currentUser) {
    UserManager.setUser(currentUser);
  }
}

export { mockUsers };
