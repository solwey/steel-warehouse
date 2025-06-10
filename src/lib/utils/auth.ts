import { User } from '@prisma/client';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
}

export function setAuthenticated(value: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('isAuthenticated', value ? 'true' : 'false');
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
}
