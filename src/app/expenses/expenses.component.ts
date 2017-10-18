import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';


import { toast } from 'angular2-materialize';
import { Expense } from './expense.model';
import { User } from '../login/user.model';

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

		this.getlistSubscription = this.db.list<Expense[]>(`${this.currentUser.uid}/expenses`).valueChanges().subscribe((rs: Expense[]) => {		
			this.expenses = rs;	
			this.showProgress = false;
		});
	}

	removeExpense(evt, expense): void {
		evt.preventDefault();
		if (!confirm(`Are you sure you want to delete "${expense.Name}" ?`)) return;

		this
			.db
			.object(`${this.currentUser.uid}/expenses/${expense.Identifier}`)
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
