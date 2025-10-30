import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Navbar } from './components/navbar/navbar';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Gastos } from './pages/gastos/gastos';
import { Home } from './pages/home/home';
import { Ingresos } from './pages/ingresos/ingresos';
import { Profile } from './pages/profile/profile';
import { ProfileForm } from './pages/profile/profile-form/profile-form';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch: 'full'},
    {path:'home', component: Home},
    {path:'login', component: Login},
    {path:'register', component: Register},
    {path:'dashboard', component: Dashboard},
    {path:'navbar', component: Navbar},
    {path:'profile', component: Profile},
    {path:'gastos', component: Gastos},
    {path:'ingresos', component: Ingresos},
    {path:'profile-form', component: ProfileForm},
    {path:'**', component: Login}, // Manejo de rutas desconocidas
];
