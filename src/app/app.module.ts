import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterializeModule } from 'angular2-materialize';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { NothingFoundComponent } from './nothing-found/nothing-found.component';
import { RegisterComponent } from './register/register.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { GainsComponent } from './gains/gains.component';
import { CategoriesComponent } from './categories/categories.component';
import { NewGainsComponent } from './new-gains/new-gains.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'gains', component: GainsComponent },
  { path: 'gains/edit/:key', component: NewGainsComponent },
  { path: 'gains/new', component: NewGainsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '', component: LoginComponent },
  { path: '**', component: NothingFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    NothingFoundComponent,
    RegisterComponent,
    ExpensesComponent,
    GainsComponent,
    CategoriesComponent,
    NewGainsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase, 'finances'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MaterializeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
