import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-get-accounts',
  templateUrl: './get-accounts.component.html',
  styleUrls: ['./get-accounts.component.css'] // Link to the CSS file
})
export class GetAccountsComponent {
  accountsForm: FormGroup;
  accounts: any[] = [];

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    // Initialize form with validation
    this.accountsForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  fetchAccounts() {
    if (this.accountsForm.valid) {
      const customerId = this.accountsForm.get('customerId')?.value;
      this.accountService.getAccountsByCustomerId(customerId).subscribe(
        (data) => {
          this.accounts = data;
          Swal.fire({
            icon: 'success',
            title: 'Accounts Retrieved!',
            text: 'Accounts have been retrieved successfully.',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });
        },
        (error) => {
          console.error('Error fetching accounts', error);
          Swal.fire({
            icon: 'error',
            title: 'Fetch Failed!',
            text: 'Unable to retrieve accounts. Please check the Customer ID and try again.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input!',
        text: 'Please enter a valid Customer ID.'
      });
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.accountsForm);
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
