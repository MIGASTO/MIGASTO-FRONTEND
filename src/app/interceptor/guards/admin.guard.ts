import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        router.navigate(['/auth/login']);
        return false;
    }

    const userRole = authService.getUserRole();

    if (userRole === 'admin' || userRole === 'ADMIN') {
        return true; 
    }

    alert('Acceso denegado: Se requieren permisos de administrador.');

    router.navigate(['/home']);
    
  return false; 
};