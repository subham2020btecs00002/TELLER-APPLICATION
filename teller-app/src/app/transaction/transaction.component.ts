// src/app/transaction/transaction.component.ts
import { Component } from '@angular/core';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
    amount: number = 0;
    type: string = '';
    accountId: number = 0;
    
  constructor(private transactionService: TransactionService) {}

  onSubmit() {
    const transactionData = {
      amount: this.amount,
      type: this.type,
      account: { accountId: this.accountId }
    };

    this.transactionService.createTransaction(transactionData).subscribe(
      response => {
        console.log('Transaction successful', response);
      },
      error => {
        console.error('Error processing transaction', error);
      }
    );
  }
}
