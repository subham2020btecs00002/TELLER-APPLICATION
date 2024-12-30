// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  password: string = '';
  email: string = '';
  roles: string = 'ROLE_MAKER'; // Default role, can be changed dynamically if required

  constructor(private authService: AuthService) {}

  onSubmit() {
    const newUser = {
      name: this.name,
      password: this.password,
      email: this.email,
      roles: this.roles
    };

    this.authService.register(newUser).subscribe(
      response => {
        console.log('User registered successfully', response);
      },
      error => {
        console.error('Error registering user', error);
      }
    );
  }
}
