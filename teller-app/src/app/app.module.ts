import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import {AuthComponent} from './auth/auth.component'
import {CustomerComponent} from './customer/customer.component'
import {RegisterComponent} from './register/register.component'
import {TransactionComponent} from './transaction/transaction.component';
import {PendingTransactionsComponent} from './transaction/pending-transactions.component';
// import {ApproveTransactionComponent} from './transaction/approve-transaction.component';
import {HomeComponent} from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component'
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    AuthComponent,
    CustomerComponent,
    RegisterComponent,
    TransactionComponent,
    // ApproveTransactionComponent,
    PendingTransactionsComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,        // Add FormsModule here
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
