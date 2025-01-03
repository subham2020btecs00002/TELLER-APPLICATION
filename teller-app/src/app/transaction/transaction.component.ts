// src/app/transaction/transaction.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  transactionForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    // Initialize form with validation
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      type: ['', [Validators.required]],
      accountId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transactionData = {
        amount: this.transactionForm.get('amount')?.value,
        type: this.transactionForm.get('type')?.value,
        account: { accountId: this.transactionForm.get('accountId')?.value }
      };
  
      this.transactionService.createTransaction(transactionData).subscribe(
        response => {
          // Show success message using SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Transaction Successful!',
            text: 'Transaction has been processed successfully.',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });
  
          // Optionally reset the form
          this.transactionForm.reset();
        },
        error => {
          console.error('Error processing transaction', error);
          Swal.fire({
            icon: 'error',
            title: 'Transaction Failed!',
            text: 'Please check your details and try again.'
          });
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly!';
      this.successMessage = '';
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.transactionForm);
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
