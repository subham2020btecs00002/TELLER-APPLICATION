// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRoles = this.authService.getUserRoles(); // Extract roles from JWT token
    const requiredRoles = route.data['roles'] as Array<string>;
  
    if (this.authService.isAuthenticated() && requiredRoles.some(role => userRoles.includes(role))) {
      return true;
    }
  
    this.router.navigate(['/auth']); // Redirect to login if not authorized
    return false;
  }
  }
