import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.css']
})
export class PendingTransactionsComponent implements OnInit {
  pendingTransactions: any[] = [];

  constructor(private transactionService: TransactionService, private router: Router) {}

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
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${approve ? 'approve' : 'reject'} this transaction?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transactionService.approveTransaction(transactionId, approve, { responseType: 'text' }).subscribe(
          (response) => {
            console.log('Transaction approved/rejected:', response);
            Swal.fire({
              title: approve ? 'Approved!' : 'Rejected!',
              text: response,
              icon: approve ? 'success' : 'error',
              confirmButtonText: 'OK'
            }).then(() => {
              // Hard refresh the page to update the list
              window.location.reload();
            });
          },
          (error) => {
            console.error('Error approving/rejecting transaction:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error processing the transaction.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }
}
