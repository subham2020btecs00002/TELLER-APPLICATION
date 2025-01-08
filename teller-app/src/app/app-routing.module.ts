import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CustomerComponent } from './customer/customer.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './register/register.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PendingTransactionsComponent } from './transaction/pending-transactions.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { GetAccountsComponent } from './account/get-accounts.component';
import { GetBalancesComponent } from './account/get-balances.component';
import { GetAccountDetailsComponent } from './account/get-account-details.component';
import { EStatementComponent } from './e-statement/e-statement.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'account/get-accounts', component: GetAccountsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'account/get-balances', component: GetBalancesComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'account/get-account-details', component: GetAccountDetailsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'transaction/create', component: TransactionComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'transaction/pending', component: PendingTransactionsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_AUTHORIZER', 'ROLE_CHECKER'] }},
  { path: 'e-statement', component: EStatementComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
