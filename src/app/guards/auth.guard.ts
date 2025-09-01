import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users.service';

export const authGuard: CanActivateFn = (route, state) => {
  let userService = inject(UsersService);
  return userService.isAuthenticated();
};

