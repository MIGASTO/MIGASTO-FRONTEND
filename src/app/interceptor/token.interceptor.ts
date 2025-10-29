import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  //console.log('🧩 Interceptor ejecutado');
  //console.log('Token en localStorage:', token ? '✅ Sí hay token' : '❌ No hay token');

  if (token) {
    const clone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clone);
  }

  return next(req);
};
