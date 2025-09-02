import { CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users.service';
import { inject } from '@angular/core';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  // Placeholder for role-based access control logic
  let userService = inject(UsersService);
  return userService.userRole() === 'admin';
};

export const sellerGuard: CanActivateFn = (route, state) => {
  let userService = inject(UsersService);
  return userService.userRole() === 'Seller';
}

export const userGuard: CanActivateFn = (route, state) => {
  let userService = inject(UsersService);
  return userService.userRole() === 'User';
}