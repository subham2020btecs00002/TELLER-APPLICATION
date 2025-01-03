import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

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
        (token) => {
          // Save the token
          this.authService.saveToken(token);

          // Emit the login event with the username
          this.authService.loginEvent.next(username);

          // Show success message with SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Login successful!',
            text: 'Redirecting to the homepage...',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });

          // Redirect after success
          setTimeout(() => {
            this.router.navigate(['/home']); // Redirect to home
          }, 1500);
        },
        (error) => {
          console.error('Login error:', error);
          // Show error message with SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Login failed!',
            text: 'Invalid credentials. Please try again.'
          });
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly!';
      this.successMessage = '';
    }
  }
}
