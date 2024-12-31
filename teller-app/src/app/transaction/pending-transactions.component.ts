// src/app/transaction/pending-transactions.component.ts
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.css']
})
export class PendingTransactionsComponent implements OnInit {
  pendingTransactions: any[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getPendingTransactions();
  }

  getPendingTransactions() {
    this.transactionService.getPendingTransactions().subscribe(
      (transactions) => {
        this.pendingTransactions = transactions;
        console.log('Pending transactions:', transactions);
      },
      (error) => {
        console.error('Error fetching pending transactions:', error);
      }
    );
  }
}
