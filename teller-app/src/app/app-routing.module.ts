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

const routes: Routes = [
  // { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_MAKER'] }},
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_AUTHORIZER', 'ROLE_CHECKER'] }},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
