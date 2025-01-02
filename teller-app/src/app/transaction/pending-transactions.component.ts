import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.css']
})
export class PendingTransactionsComponent implements OnInit {
  pendingTransactions: any[] = [];

  constructor(private transactionService: TransactionService,private router: Router
  ) {}

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

  approveTransaction(transactionId: number, approve: boolean) {
    this.transactionService.approveTransaction(transactionId, approve).subscribe(
      (response) => {
        console.log('Transaction approved/rejected:', response);
        // Update the specific transaction in the list
        const index = this.pendingTransactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
          this.pendingTransactions[index].status = approve ? 'approved' : 'rejected';
        }
      },
      (error) => {
        console.error('Error approving/rejecting transaction:', error);
      }
    );
  }
  }
