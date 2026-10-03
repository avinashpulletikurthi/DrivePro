import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://vehicle-rental-system-production-2800.up.railway.app';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(
      this.apiUrl,
      {
        username: username,
        password: password
      },
      {
        responseType: 'text'
      }
    );
  }

saveToken(token: string) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem('token', token);
}

getToken() {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
}

isLoggedIn(): boolean {
  return this.getToken() !== null;
}

getRole(): string | null {
  const token = this.getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}
getUserId(): number | null {
  const token = this.getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || null;
  } catch {
    return null;
  }
}
getUserInfo(): any {
  const token = this.getToken();

  if (!token) {
    return null;
  }

  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

isAdmin(): boolean {
  return this.getRole() === 'ADMIN';
}

logout() {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem('token');
}
}