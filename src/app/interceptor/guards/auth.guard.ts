import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log('✅ GUARD: Acceso permitido (Token verificado y válido).');
    return true;
  } else {
    console.error('⛔ GUARD: Acceso denegado (Sin token o expirado).');
    router.navigate(['/login']);
    return false;
  }
};