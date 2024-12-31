import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  hasRole(role: string): boolean {
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes(role);
  }
  
  isAuthenticated(): boolean {
    return !!this.authService.getToken();
  }

  logout(): void {
    this.authService.logout();
  }
}
