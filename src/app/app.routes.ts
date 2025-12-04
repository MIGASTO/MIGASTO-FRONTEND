import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { DashboardGastos } from './components/dashboard/dashboard-gastos/dashboard-gastos';
import { DashboardIngresos } from './components/dashboard/dashboard-ingresos/dashboard-ingresos';
import { ProfileForm } from './components/formularios/profile-form/profile-form';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Gastos } from './pages/gastos/gastos';
import { Home } from './pages/home/home';
import { Ingresos } from './pages/ingresos/ingresos';
import { Profile } from './pages/profile/profile';


import { authGuard } from './interceptor/guards/auth.guard';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { Prestamos } from './pages/prestamos/prestamos';
import { Admin } from './components/admin-panel/admin';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { TagsComponent } from './pages/admin/tags/tags.component';
import { GenerosComponent } from './pages/admin/generos/generos.component';
import { MonedasComponent } from './pages/admin/monedas/monedas.component';

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
    {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard]
    },
    {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tags',
        component: TagsComponent,
        canActivate: [authGuard]
    },
        {
        path: 'generos',
        component: GenerosComponent,
        canActivate: [authGuard]
    },
            {
        path: 'monedas',
        component: MonedasComponent,
        canActivate: [authGuard]
    },

    {path:'**', component: Home},
];
