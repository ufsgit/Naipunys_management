import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const data = inject(DataService);

  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  return data.preload().pipe(map(() => true));
};
