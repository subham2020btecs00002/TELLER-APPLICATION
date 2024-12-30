import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8088/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/generateToken`, { username, password }, { responseType: 'text' });
  }
  register(newUser: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNewUser`, newUser);
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string {
    const token = localStorage.getItem('authToken');
    return token !== null ? token : '';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRoles(): string {
    const token = this.getToken();
    if (token) {
      try {
        // Decode the token using jwt-decode
        const decoded: { roles: string } = jwtDecode(token);
  
        // Check if roles is a valid JSON array or a plain string
        localStorage.setItem('ROLE', decoded.roles);
        console.log(decoded);

        return decoded.roles;
      } catch (error) {
        console.error('Error decoding or parsing roles:', error);
        return '' ;
      }
    }
    return '';
  }
          
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRoles');
    this.router.navigate(['/login']);
  }
}
