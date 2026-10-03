import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  username = '';
  password = '';
  confirmPassword = '';

  message = '';
  errorMessage = '';

  private apiUrl = 'http://localhost:8080/users/register';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(): void {

    if (!this.username.trim()) {
  this.errorMessage = 'Username is required.';
  return;
}

if (!this.password) {
  this.errorMessage = 'Password is required.';
  return;
}

if (this.password.length < 6) {
  this.errorMessage = 'Password must be at least 6 characters.';
  return;
}

if (this.password !== this.confirmPassword) {
  this.errorMessage = 'Passwords do not match.';
  return;
}


    this.message = '';
    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a username.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter a password.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.http.post<any>(
      this.apiUrl,
      {
        username: this.username,
        password: this.password
      }
    ).subscribe({

      next: () => {
        this.message = 'Account created successfully!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

     error: (error) => {
  console.error('REGISTRATION ERROR:', error);

  this.errorMessage =
    error.error?.message ||
    'Registration failed. Please try again.';
}

    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}