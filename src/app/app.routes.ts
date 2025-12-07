import { Routes } from '@angular/router';
import { DashboardGastos } from './components/dashboard/dashboard-gastos/dashboard-gastos';
import { DashboardIngresos } from './components/dashboard/dashboard-ingresos/dashboard-ingresos';
import { ProfileForm } from './components/formularios/profile-form/profile-form';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Gastos } from './pages/gastos/gastos';
import { Home } from './pages/home/home';
import { Ingresos } from './pages/ingresos/ingresos';
import { Profile } from './pages/profile/profile';


import { DashboardGeneral } from './components/dashboard/dashboard-general/dashboard-general';
import { adminGuard } from './interceptor/guards/admin.guard';
import { authGuard } from './interceptor/guards/auth.guard';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home';
import { AdminMovimientos } from './pages/admin/admin-movimientos/admin-movimientos';
import { GenerosComponent } from './pages/admin/generos/generos.component';
import { MonedasComponent } from './pages/admin/monedas/monedas.component';
import { TagsComponent } from './pages/admin/tags/tags.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { Prestamos } from './pages/prestamos/prestamos';
import { TagsUser } from './pages/tags-user/tags-user';

export const routes: Routes = [

    { path:'', redirectTo: 'home', pathMatch: 'full'},


    { path:'login', component: Login},
    { path:'register', component: Register},
    { path: 'recuperar-password', component: ResetPassword,},



    
    {
        path: 'admin',
        canActivate: [adminGuard], 
        children: [
            { path: 'dashboard', component: AdminHomeComponent },
            { path: 'users', component: AdminHomeComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            {
                path: 'usuarios',
                component: UsuariosComponent,
            },
            {
                path: 'tags',
                component: TagsComponent,
            },
            {
                path: 'generos',
                component: GenerosComponent,
            },
            {
                path: 'monedas',
                component: MonedasComponent,
            },
            {
                path: 'movimientos',
                component: AdminMovimientos, 
            },
            {path:'**', component: AdminHomeComponent},
                
        ]
    },
    {
        path:'home',
        component: Home,
        canActivate: [authGuard] 
    },
    {
        path:'dashboard-general',
        component: DashboardGeneral,
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
        path : 'tags-user',
        component: TagsUser,
        canActivate: [authGuard]
    },

    {path:'**', component: Home},
];
