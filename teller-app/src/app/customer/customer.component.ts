import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  customerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    // Initialize form with validation
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      this.customerService.createCustomer(customerData).subscribe(
        response => {
          // Show success message using SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Customer Created!',
            text: 'Customer has been created successfully.',
            showConfirmButton: false,
            timer: 1500 // 1.5 seconds delay
          });

          // Optionally reset the form
          this.customerForm.reset();
        },
        error => {
          console.error('Error creating customer', error);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed!',
            text: 'Please check your details and try again.'
          });
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly!';
      this.successMessage = '';
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.customerForm);
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
