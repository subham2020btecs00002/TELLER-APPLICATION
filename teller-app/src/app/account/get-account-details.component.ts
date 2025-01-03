import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-get-account-details',
  templateUrl: './get-account-details.component.html',
  styleUrls: ['./get-account-details.component.css'] // Link to the CSS file
})
export class GetAccountDetailsComponent {
  accountNumber: string = '';
  account: any;

  constructor(private accountService: AccountService) {}

  fetchAccountDetails() {
    if (!this.accountNumber.trim()) {
      alert("Please enter a valid account number.");
      return;
    }
    this.accountService.getAccountByAccountNumber(this.accountNumber).subscribe(
      (data) => (this.account = data),
      (error) => console.error(error)
    );
  }
}
