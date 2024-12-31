// src/app/transaction/approve-transaction.component.ts
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approve-transaction',
  templateUrl: './approve-transaction.component.html',
  styleUrls: ['./approve-transaction.component.css']
})
export class ApproveTransactionComponent implements OnInit {
  transactionId: number = 0;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.transactionId = +this.route.snapshot.paramMap.get('transactionId')!;
  }

  approveTransaction(approve: boolean) {
    this.transactionService.approveTransaction(this.transactionId, approve).subscribe(
      (response) => {
        console.log(`Transaction ${approve ? 'approved' : 'rejected'}`, response);
      },
      (error) => {
        console.error('Error approving/rejecting transaction:', error);
      }
    );
  }
}
