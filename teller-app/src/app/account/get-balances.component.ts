import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-get-balances',
  templateUrl: './get-balances.component.html',
  styleUrls: ['./get-balances.component.css'] // Link to the CSS file
})
export class GetBalancesComponent {
  customerId!: number;
  accountNumber: string = '';
  balances: any;

  constructor(private accountService: AccountService) {}

  fetchBalances() {
    if (!this.customerId || !this.accountNumber.trim()) {
      alert('Please provide both Customer ID and Account Number.');
      return;
    }
    this.accountService.getBalances(this.customerId, this.accountNumber).subscribe(
      (data) => (this.balances = data),
      (error) => console.error(error)
    );
  }
}
