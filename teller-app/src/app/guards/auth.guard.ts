// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const userRoles = this.authService.getUserRoles();
      const requiredRoles = route.data['roles'] as Array<string>;

      if (requiredRoles) {
        if (requiredRoles.some(role => userRoles.includes(role))) {
          return true;
        }
        this.router.navigate(['/auth']); // Redirect if roles don't match
      }
      return true; // If no specific roles are required
    }
    this.router.navigate(['/auth']); // Redirect to login if not authenticated
    return false;
  }
}
