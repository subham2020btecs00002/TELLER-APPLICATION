import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: ['ROLE_MAKER', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.registerForm.valid) {
      const newUser = this.registerForm.value;
      this.authService.register(newUser).subscribe(
        response => {
          console.log(response); // Should log "User Added Successfully"
          
          // Show success message with SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'You have been registered successfully.',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });

          // Redirect after success
          setTimeout(() => {
            this.router.navigate(['/auth']); // Redirect to login
          }, 1500);
        },
        error => {
          console.error('Error registering user', error);
          
          // Show error message with SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed!',
            text: 'Please check your details and try again.'
          });
          
          this.errorMessage = 'Registration failed!';
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly!';
      this.successMessage = '';
    }
  }
}
