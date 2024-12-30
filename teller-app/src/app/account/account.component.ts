// src/app/account/account.component.ts
import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
    openingBalance: number = 0;
    accountNumber: string = '';
    customerId: number = 0;
    
  constructor(private accountService: AccountService) {}

  onSubmit() {
    const accountData = {
      openingBalance: this.openingBalance,
      accountNumber: this.accountNumber,
      customer: { customerId: this.customerId }
    };

    this.accountService.createAccount(accountData).subscribe(
      response => {
        console.log('Account created successfully', response);
      },
      error => {
        console.error('Error creating account', error);
      }
    );
  }
}
