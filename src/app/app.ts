import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  RouterOutlet,
  RouterLink,
  RouterLinkActive
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  showNavbar(): boolean {
    return this.authService.isLoggedIn()
      && this.router.url !== '/login';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}