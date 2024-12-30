// src/app/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8088/api/customers';

  constructor(private http: HttpClient) {}

  createCustomer(customerData: any): Observable<any> {
    return this.http.post(this.apiUrl, customerData);
  }
}
