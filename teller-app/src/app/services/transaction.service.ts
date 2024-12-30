// src/app/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8088/api/transactions';

  constructor(private http: HttpClient) {}

  createTransaction(transactionData: any): Observable<any> {
    return this.http.post(this.apiUrl, transactionData);
  }
}
