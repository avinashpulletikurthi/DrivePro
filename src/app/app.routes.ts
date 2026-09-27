import { Routes } from '@angular/router';
import { Vehicles } from './vehicles/vehicles';
import { Login } from './login/login';
import { RentalHistory } from './rental-history/rental-history';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'vehicles',
    component: Vehicles
  },
  {
    path: 'rentals',
    component: RentalHistory
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];