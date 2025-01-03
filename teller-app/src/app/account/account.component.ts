import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  accountForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    // Initialize form with validation
    this.accountForm = this.fb.group({
      openingBalance: ['', [Validators.required, Validators.min(0)]],
      accountNumber: ['', [Validators.required, Validators.minLength(5)]],
      customerId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const accountData = {
        openingBalance: this.accountForm.get('openingBalance')?.value,
        accountNumber: this.accountForm.get('accountNumber')?.value,
        customer: { customerId: this.accountForm.get('customerId')?.value }
      };
  
      this.accountService.createAccount(accountData).subscribe(
        response => {
          // Show success message using SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'Account has been created successfully.',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });
  
          // Optionally reset the form
          this.accountForm.reset();
        },
        error => {
          console.error('Error creating account', error);
          Swal.fire({
            icon: 'error',
            title: 'Creation Failed!',
            text: 'Please check your details and try again.'
          });
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly!';
      this.successMessage = '';
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.accountForm);
    }
  }
  
  // Helper function to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
