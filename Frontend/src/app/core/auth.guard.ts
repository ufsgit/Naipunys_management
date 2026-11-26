import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const data = inject(DataService);

  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  data.preload().subscribe();
  return true;
};
