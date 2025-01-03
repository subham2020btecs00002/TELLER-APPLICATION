import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-get-account-details',
  templateUrl: './get-account-details.component.html',
  styleUrls: ['./get-account-details.component.css'] // Link to the CSS file
})
export class GetAccountDetailsComponent {
  accountForm: FormGroup;
  account: any;

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    // Initialize form with validation
    this.accountForm = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  fetchAccountDetails() {
    if (this.accountForm.valid) {
      const accountNumber = this.accountForm.get('accountNumber')?.value;
      this.accountService.getAccountByAccountNumber(accountNumber).subscribe(
        (data) => {
          this.account = data;
          Swal.fire({
            icon: 'success',
            title: 'Account Found!',
            text: 'Account details have been retrieved successfully.',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });
        },
        (error) => {
          console.error('Error fetching account details', error);
          Swal.fire({
            icon: 'error',
            title: 'Fetch Failed!',
            text: 'Unable to retrieve account details. Please check the account number and try again.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input!',
        text: 'Please enter a valid account number.'
      });
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
