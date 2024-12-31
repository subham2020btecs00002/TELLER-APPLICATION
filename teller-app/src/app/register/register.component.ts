import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  password: string = '';
  email: string = '';
  roles: string = 'ROLE_MAKER';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const newUser = {
      name: this.name,
      password: this.password,
      email: this.email,
      roles: this.roles
    };

    this.authService.register(newUser).subscribe(
      response => {
        console.log(response); // Should log "User Added Successfully"
        this.router.navigate(['/auth']); // Redirect to login
      },
      error => {
        console.error('Error registering user', error);
      }
    );
  }
}
