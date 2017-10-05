import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { User } from '../user';
import { Expense } from '../expense';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit, OnDestroy {

  getlistSubscription: Subscription;

  currentUser: User = (localStorage.currentUser) ? JSON.parse(localStorage.currentUser) : new User();

  expenses: Expense[] = [];
  showProgress: boolean = true;

  constructor(
    public db: AngularFireDatabase,
    public router: Router
  ) { }

  ngOnInit() {
    if (this.currentUser.uid === "") {
      this.router.navigateByUrl('login')
      return;
    }

    this.getlistSubscription = this.db.list(`${this.currentUser.uid}/expenses`).subscribe(rs => {
      this.expenses = rs
      this.showProgress = false;
    });
  }

  removeExpense(evt, expense): void {
    evt.preventDefault();
    if (!confirm(`Are you sure you want to delete "${expense.Name}" ?`)) return;

    this
      .db
      .object(`${this.currentUser.uid}/expenses/${expense.$key}`)
      .remove()
      .then(rs => {
        this.showProgress = false;
        toast(rs, 2500)
      })
      .catch(error => {
        this.showProgress = false;
        toast(error.message, 2500)
      })
  }

  ngOnDestroy() {
    if (this.getlistSubscription) this.getlistSubscription.unsubscribe();
  }

}
