import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-get-balances',
  templateUrl: './get-balances.component.html',
  styleUrls: ['./get-balances.component.css'] // Link to the CSS file
})
export class GetBalancesComponent {
  balancesForm: FormGroup;
  balances: any;

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    // Initialize form with validation
    this.balancesForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      accountNumber: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  fetchBalances() {
    if (this.balancesForm.valid) {
      const customerId = this.balancesForm.get('customerId')?.value;
      const accountNumber = this.balancesForm.get('accountNumber')?.value;
      this.accountService.getBalances(customerId, accountNumber).subscribe(
        (data) => {
          this.balances = data;
          Swal.fire({
            icon: 'success',
            title: 'Balances Retrieved!',
            text: 'Account balances have been retrieved successfully.',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });
        },
        (error) => {
          console.error('Error fetching balances', error);
          Swal.fire({
            icon: 'error',
            title: 'Fetch Failed!',
            text: 'Unable to retrieve account balances. Please check the details and try again.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input!',
        text: 'Please provide both Customer ID and Account Number.'
      });
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.balancesForm);
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
