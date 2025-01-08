import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-e-statement',
  templateUrl: './e-statement.component.html',
  styleUrls: ['./e-statement.component.css']
})
export class EStatementComponent {
  customerId: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  downloadEStatement() {
    if (!this.customerId) {
      alert('Please enter a valid Customer ID');
      return;
    }

    const url = `http://localhost:8088/api/customers/${this.customerId}/statement`;
    const token = this.authService.getToken(); // Get the token from AuthService

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add the token to the Authorization header
    });

    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Customer_${this.customerId}_Statement.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert('Error downloading e-statement. Please try again.');
        console.error(err);
      }
    });
  }
}
