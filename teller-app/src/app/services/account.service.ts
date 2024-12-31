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

  createAccount(accountData: any): Observable<any> {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(this.apiUrl, accountData, { headers });
  }
}
