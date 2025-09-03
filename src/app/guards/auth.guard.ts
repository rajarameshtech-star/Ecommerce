import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users.service';

export const authGuard: CanActivateFn = (route, state) => {
  let userService = inject(UsersService);
  return userService.isAuthenticated();
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  let userService = inject(UsersService);
  return !userService.isAuthenticated();
}

export const timeoutGuard: CanActivateFn = (route, state) => {
  const expiresAt = localStorage.getItem('expiresAt');
  if (!expiresAt) return false;
  let userService = inject(UsersService);

  const isExpired = new Date(expiresAt).getTime() < Date.now();
  if (isExpired) {
    userService.logoutUser();
    return false;
  }

  return true;
}

