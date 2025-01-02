import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        token => {
          // Save the token
          this.authService.saveToken(token);

          // Emit the login event with the username
          this.authService.loginEvent.next(username);

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
    } else {
      this.errorMessage = 'Please fill in the form correctly!';
    }
  }
}
