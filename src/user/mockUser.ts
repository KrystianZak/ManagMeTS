import { User } from '../models/User';
import { UserManager } from '../storage/UserManager';

export const mockUser: User = {
  id: '1',
  firstName: 'Krystian',
  lastName: 'Zak',
};

export function setupMockUser() {
  UserManager.setUser(mockUser);
}