// src/app/services/transaction.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8088/api/transactions';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private getHeaders(): HttpHeaders {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      if (token) {
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
      }
    }
    return new HttpHeaders(); // Return empty headers if not in a browser environment or no token found
  }

  createTransaction(transactionData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, transactionData, { headers });
  }

  getPendingTransactions(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/pending`, { headers });
  }

  approveTransaction(transactionId: number, approve: boolean): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/${transactionId}/approve?approve=${approve}`, {}, { headers });
  }
}
