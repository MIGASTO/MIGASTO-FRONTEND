import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch: 'full'},
    {path:'home', component: Home},
    {path:'login', component: Login},
    {path:'register', component: Register},
    {path:'dashboard', component: Dashboard},
    {path:'profile', component: Profile},
    {path:'**', component: Login}, // Manejo de rutas desconocidas
];
