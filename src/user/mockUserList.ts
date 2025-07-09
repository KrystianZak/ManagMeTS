import { User } from '../models/User';

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Krystian',
    lastName: 'Zak',
    role: 'admin',
  },
  {
    id: '2',
    firstName: 'Julia',
    lastName: 'Nowak',
    role: 'developer',
  },
  {
    id: '3',
    firstName: 'Michał',
    lastName: 'Kowalski',
    role: 'devops',
  },
];

// ✅ DODAJ TO:
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}
