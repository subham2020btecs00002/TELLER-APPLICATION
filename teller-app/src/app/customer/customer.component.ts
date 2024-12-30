// src/app/customer/customer.component.ts
import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
    name: string = '';
    email: string = '';
    phoneNumber: string = '';
    gender: string = '';
    address: string = '';
    
  constructor(private customerService: CustomerService) {}

  onSubmit() {
    const customerData = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      address: this.address
    };

    this.customerService.createCustomer(customerData).subscribe(
      response => {
        console.log('Customer created successfully', response);
      },
      error => {
        console.error('Error creating customer', error);
      }
    );
  }
}
