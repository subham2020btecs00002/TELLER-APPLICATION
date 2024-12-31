// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { CustomerComponent } from './customer/customer.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './register/register.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AuthGuard } from './guards/auth.guard';
import {ApproveTransactionComponent} from './transaction/approve-transaction.component';
import {PendingTransactionsComponent} from './transaction/pending-transactions.component'
import { HomeComponent } from './home/home.component'; // Import HomeComponent

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Home route protected by AuthGuard
  { path: 'register', component: RegisterComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'transaction/create', component: TransactionComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'transaction/pending', component: PendingTransactionsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_AUTHORIZER', 'ROLE_CHECKER'] }},
  { path: 'transaction/:transactionId/approve', component: ApproveTransactionComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_AUTHORIZER'] }},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
