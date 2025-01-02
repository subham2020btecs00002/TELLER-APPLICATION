import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';

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
          this.router.navigate(['/auth']); // Redirect to login
        },
        error => {
          console.error('Error registering user', error);
          this.errorMessage = 'Registration failed!';
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly!';
    }
  }
}
