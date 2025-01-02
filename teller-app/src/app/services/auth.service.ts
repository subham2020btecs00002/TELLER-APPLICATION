import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8088/auth';
  loginEvent: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: object) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/generateToken`, { username, password }, { responseType: 'text' });
  }

  register(newUser: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNewUser`, newUser, { responseType: 'text' });
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      return token !== null ? token : '';
    }
    return '';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUsername(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        try {
          const decoded: { sub: string } = jwtDecode(token); // Assuming 'sub' contains the username
          return decoded.sub;
        } catch (error) {
          console.error('Error decoding or parsing username:', error);
          return '';
        }
      }
    }
    return '';
  }

  getUserRoles(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        try {
          const decoded: { roles: string, sub: string } = jwtDecode(token);
          localStorage.setItem('ROLE', decoded.roles);
          localStorage.setItem('sub', decoded.sub);
          console.log(decoded);
          return decoded.roles;
        } catch (error) {
          console.error('Error decoding or parsing roles:', error);
          return '';
        }
      }
    }
    return '';
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('ROLE');
      localStorage.removeItem('sub');
    }
    this.router.navigate(['/auth']);
  }
}
