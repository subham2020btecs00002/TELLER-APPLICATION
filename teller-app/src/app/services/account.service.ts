import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8088/api/accounts';

  constructor(private http: HttpClient, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: object) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Create Account
  createAccount(accountData: any): Observable<any> {
    return this.http.post(this.apiUrl, accountData, { headers: this.getHeaders() });
  }

  // Get all accounts of a customer by ID
  getAccountsByCustomerId(customerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/customer/${customerId}`, { headers: this.getHeaders() });
  }

  // Get opening and closing balances by account number
  getBalances(customerId: number, accountNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${customerId}/account/${accountNumber}/balances`, { headers: this.getHeaders() });
  }

  // Get account details by account number
  getAccountByAccountNumber(accountNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/number/${accountNumber}`, { headers: this.getHeaders() });
  }
}
