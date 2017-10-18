import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { NewExpensesComponent } from './expenses/new-expenses/new-expenses.component';
import { GainsComponent } from './gains/gains.component';
import { NewGainsComponent } from './gains/new-gains/new-gains.component';
import { CategoriesComponent } from './categories/categories.component';
import { NothingFoundComponent } from './nothing-found/nothing-found.component';

export const ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'expenses', component: ExpensesComponent },
    { path: 'expenses/edit/:key', component: NewExpensesComponent },
    { path: 'expenses/new', component: NewExpensesComponent },
    { path: 'gains', component: GainsComponent },
    { path: 'gains/edit/:key', component: NewGainsComponent },
    { path: 'gains/new', component: NewGainsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: '', component: LoginComponent },
    { path: '**', component: NothingFoundComponent }
];