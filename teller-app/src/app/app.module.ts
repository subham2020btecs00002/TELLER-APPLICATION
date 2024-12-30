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
import {TransactionComponent} from './transaction/transaction.component'

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    AuthComponent,
    CustomerComponent,
    RegisterComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,        // Add FormsModule here
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
