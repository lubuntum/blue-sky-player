import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { guestGuard } from './guard/guest-guard';
import { Home } from './components/home/home';
import { authGuard } from './guard/auth-guard';
import { Main } from './components/main/main';

export const routes: Routes = [
    {
        path: 'login', 
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'main',
        component: Main,
        canActivate: [guestGuard]
    },
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: '**', redirectTo: '/main' }
];
