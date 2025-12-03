import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { DashboardGastos } from './pages/gastos/dashboard-gastos/dashboard-gastos';
import { Gastos } from './pages/gastos/gastos';
import { Home } from './pages/home/home';
import { DashboardIngresos } from './pages/ingresos/dashboard-ingresos/dashboard-ingresos';
import { Ingresos } from './pages/ingresos/ingresos';
import { Profile } from './pages/profile/profile';
import { ProfileForm } from './pages/profile/profile-form/profile-form';


import { authGuard } from './interceptor/guards/auth.guard';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { Prestamos } from './pages/prestamos/prestamos';

export const routes: Routes = [

    { path:'', redirectTo: 'home', pathMatch: 'full'},


    { path:'login', component: Login},
    { path:'register', component: Register},
    { path: 'recuperar-password', component: ResetPassword,},


    {
        path:'home',
        component: Home,
        canActivate: [authGuard] 
    },
    {
        path:'dashboard',
        component: Dashboard,
        canActivate: [authGuard] 
    },
    {
        path:'profile',
        component: Profile,
        canActivate: [authGuard] 
    },
    {
        path:'gastos',
        component: Gastos,
        canActivate: [authGuard] 
    },
    {
        path:'gastos/dashboard',
        component: DashboardGastos,
        canActivate: [authGuard] 
    },
    {
        path:'ingresos',
        component: Ingresos,
        canActivate: [authGuard] 
    },
    {
        path:'ingresos/dashboard',
        component: DashboardIngresos,
        canActivate: [authGuard] 
    },
    {
        path:'profile-form',
        component: ProfileForm,
        canActivate: [authGuard] 
    },

    {
        path : 'prestamos',
        component: Prestamos,
        canActivate: [authGuard]
    },

    {path:'**', component: Home},
];
