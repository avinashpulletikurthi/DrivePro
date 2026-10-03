import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Vehicles } from './vehicles/vehicles';
import { Login } from './login/login';
import { RentalHistory } from './rental-history/rental-history';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Register } from './register/register';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminRentals } from './admin-rentals/admin-rentals';
export const routes: Routes = [

    
  // Login - public
  {
    path: 'login',
    component: Login
  },
  {
  path: 'register',
  component: Register
},

  // Home - logged-in users only
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },

  // Vehicles - logged-in users only
  {
    path: 'vehicles',
    component: Vehicles,
    canActivate: [authGuard]
  },

  // Rentals - logged-in users only
  {
    path: 'rentals',
    component: RentalHistory,
    canActivate: [authGuard]
  },

  // Dashboard - ADMIN only
  {
    path: 'dashboard',
    component: AdminDashboard,
    canActivate: [authGuard, adminGuard]
  },
  {
  path: 'admin-rentals',
  component: AdminRentals,
  canActivate: [authGuard]
},
  // Default
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Unknown URL
  {
    path: '**',
    redirectTo: 'login'
  }
  
];