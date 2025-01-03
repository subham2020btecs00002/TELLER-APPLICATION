import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-get-accounts',
  templateUrl: './get-accounts.component.html',
  styleUrls: ['./get-accounts.component.css'] // Link to the CSS file
})
export class GetAccountsComponent {
  customerId!: number;
  accounts: any[] = [];

  constructor(private accountService: AccountService) {}

  fetchAccounts() {
    if (!this.customerId) {
      alert("Please enter a valid Customer ID.");
      return;
    }
    this.accountService.getAccountsByCustomerId(this.customerId).subscribe(
      (data) => (this.accounts = data),
      (error) => console.error(error)
    );
  }
}
