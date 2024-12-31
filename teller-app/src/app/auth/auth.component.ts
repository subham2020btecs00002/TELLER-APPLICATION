import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      token => {
        // Save the token
        this.authService.saveToken(token);
  
        // Decode the token to get roles
        const roles = this.authService.getUserRoles();
        console.log(roles);
  
        // Redirect to the home page after successful login
        this.router.navigate(['/home']); // Redirect to home
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid credentials!';
      }
    );
  }
}
