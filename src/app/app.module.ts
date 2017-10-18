import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { MatSelectModule, MatNativeDateModule, MatDatepickerModule, MatInputModule  } from '@angular/material';

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
import { RegisterComponent } from './shared/register/register.component';
import { ExpenseListComponent } from './expenses/expense-list/expense-list.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { GainListComponent } from './gains/gain-list/gain-list.component';
import { GainComponent } from './gains/gain/gain.component';
import { ExpenseComponent } from './expenses/expense/expense.component';
import { ROUTES } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    NothingFoundComponent,
    RegisterComponent,
    ExpenseListComponent,
    GainListComponent,
    CategoryListComponent,
    GainComponent,
    ExpenseComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    AngularFireModule.initializeApp(environment.firebase, 'finances'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MaterializeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
