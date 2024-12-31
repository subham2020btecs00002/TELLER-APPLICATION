// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userRoles: string[] = [];

  constructor(private authService: AuthService) {
    this.userRoles = this.authService.getUserRoles().split(',');
  }

  isRole(role: string): boolean {
    return this.userRoles.includes(role);
  }
}
