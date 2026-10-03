import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (token) => {
  console.log('LOGIN SUCCESS');
  console.log('TOKEN:', token);

  this.authService.saveToken(token);

  console.log('TOKEN SAVED:', localStorage.getItem('token'));

  this.router.navigate(['/home']);
}
    });
  }
  goToRegister(): void {
  this.router.navigate(['/register']);
}
}