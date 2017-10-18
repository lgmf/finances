import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../login/user.model';
import { Gain } from '../gains/gain.model';
import { Expense } from '../expenses/expense.model';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

	gainsSubscription: Subscription;
	expensesSubscription: Subscription;

	today: string = new Date().toLocaleDateString();
	currentUser: User = (localStorage.currentUser) ? JSON.parse(localStorage.currentUser) : new User();

	showProgress: boolean = true;
	items: number[];
	gains: number = 0;
	expenses: number = 0;

	private balance: number;

	constructor(
		public db: AngularFireDatabase,
		public afAuth: AngularFireAuth,
		public router: Router
	) { }

	ngOnInit(): void {
		if (this.currentUser.uid === "") {
			this.router.navigateByUrl('login')
			return;
		}

		this.gainsSubscription = this.db.list<Gain[]>(`${this.currentUser.uid}/gains`).valueChanges().subscribe((gains: Gain[]) => {
			gains.forEach(g => {
				this.gains += g.Value;
			})
			this.showProgress = false;
		});

		this.showProgress = true;

		this.expensesSubscription = this.db.list<Expense[]>(`${this.currentUser.uid}/expenses`).valueChanges().subscribe((expenses: Expense[]) => {
			expenses.forEach(e => {
				this.expenses += e.Value;
			})
			this.showProgress = false;
		});
	}

	getBalance(): number {
		return Math.round((this.expenses / this.gains) * 100);
	}

	ngOnDestroy(): void {
		if (this.gainsSubscription) this.gainsSubscription.unsubscribe();
		if (this.expensesSubscription) this.expensesSubscription.unsubscribe();
	}
}
