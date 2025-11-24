import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Gastos } from './pages/gastos/gastos';
import { DashboardGastos } from './pages/gastos/dashboard-gastos/dashboard-gastos';
import { Home } from './pages/home/home';
import { Ingresos } from './pages/ingresos/ingresos';
import { DashboardIngresos } from './pages/ingresos/dashboard-ingresos/dashboard-ingresos';
import { Profile } from './pages/profile/profile';
import { ProfileForm } from './pages/profile/profile-form/profile-form';

// Importación de tu guardia de autenticación
import { authGuard } from './interceptor/guards/auth.guard';

export const routes: Routes = [
    // RUTA RAIZ: Redirige al home (que está protegido).
    { path:'', redirectTo: 'home', pathMatch: 'full'},

    // RUTAS PÚBLICAS (NO PROTEGIDAS)
    { path:'login', component: Login},
    { path:'register', component: Register},

    // RUTAS PRIVADAS (PROTEGIDAS) - Usan canActivate: [authGuard]
    {
        path:'home',
        component: Home,
        canActivate: [authGuard] // PROTEGIDA
    },
    {
        path:'dashboard',
        component: Dashboard,
        canActivate: [authGuard] // PROTEGIDA
    },
    {
        path:'profile',
        component: Profile,
        canActivate: [authGuard] // PROTEGIDA
    },
    {
        path:'gastos',
        component: Gastos,
        canActivate: [authGuard] // PROTEGIDA
    },
    {
        path:'gastos/dashboard',
        component: DashboardGastos,
        canActivate: [authGuard] // PROTEGIDA
    },
    {
        path:'ingresos',
        component: Ingresos,
        canActivate: [authGuard] // PROTEGIDA
    },
    {
        path:'ingresos/dashboard',
        component: DashboardIngresos,
        canActivate: [authGuard] // PROTEGIDA
    },
    {
        path:'profile-form',
        component: ProfileForm,
        canActivate: [authGuard] // PROTEGIDA
    },

    // Manejo de rutas desconocidas: Redirige al login o home.
    {path:'**', component: Home},
];
