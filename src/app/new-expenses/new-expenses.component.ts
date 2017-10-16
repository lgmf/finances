import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter, NativeDateAdapter } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { Expense } from '../expense';
import { User } from '../user';
import { toast } from 'angular2-materialize';

@Component({
	selector: 'app-new-expenses',
	templateUrl: './new-expenses.component.html',
	styleUrls: ['./new-expenses.component.css']
})
export class NewExpensesComponent implements OnInit, OnDestroy {

	paramsSubscription: Subscription;
	expenseSubscription: Subscription;
	newExpenseForm: FormGroup;
	expense: Expense = new Expense("", "New Expense", 0, new Date(), "");
	currentUser: User = (localStorage.currentUser) ? JSON.parse(localStorage.currentUser) : new User();

	showProgress: boolean = false;
	isUpdate: boolean = false;

	categories = [
		{ Value: 'steak-0', Name: 'Steak' },
		{ Value: 'pizza-1', Name: 'Pizza' },
		{ Value: 'tacos-2', Name: 'Tacos' }
	];

	constructor(
		public db: AngularFireDatabase,
		public formBuilder: FormBuilder,
		public router: Router,
		public route: ActivatedRoute,
		public dateAdapter: DateAdapter<NativeDateAdapter>
	) { }

	ngOnInit() {
		this.dateAdapter.setLocale('pt-BR');
		this.newExpenseForm = this.formBuilder.group({
			name: [null],
			value: [null],
			date: [null],
			category: [new Date()]
		})
		this.paramsSubscription = this.route.params.subscribe(params => {
			if (params['key']) {
				this.expenseSubscription = this.db.object<Expense>(`${this.currentUser.uid}/expenses/${params['key']}`).valueChanges().subscribe((expense: Expense) => {
					this.expense = {
						Identifier: params['key'],
						Name: expense.Name,
						Value: expense.Value,
						Date: new Date(expense.Date),
						Category: expense.Category
					}
				});
			}
		});
	}

	saveExpense(): void {
		if (this.newExpenseForm.invalid) return;

		if (this.expense.Identifier !== "") {
			this.updateExpense();
			return;
		}

		this.showProgress = true;
		this
			.db
			.list(`${this.currentUser.uid}/expenses`)
			.push({
				Identifier: this.expense.Identifier,
				Name: this.expense.Name,
				Value: this.expense.Value,
				Date: this.expense.Date.toDateString(),
				Category: this.expense.Category
			})
			.then(rs => {
				this.showProgress = false;
				toast(rs.message, 2500)
				this.router.navigateByUrl(`/expenses`);
			}, error => {
				this.showProgress = false;
				toast(error.message, 2500)
			})
	}

	updateExpense() {
		if (!this.expense) return;

		this.showProgress = true;
		this
			.db
			.object(`${this.currentUser.uid}/expenses/${this.expense.Identifier}`)
			.update({
				Identifier: this.expense.Identifier,
				Name: this.expense.Name,
				Value: this.expense.Value,
				Date: this.expense.Date.toDateString(),
				Category: this.expense.Category
			})
			.then(rs => {
				this.showProgress = false;
				toast(rs, 2500)
				this.router.navigateByUrl(`/expenses`);
			})
			.catch(error => {
				this.showProgress = false;
				toast(error.message, 2500)
			})
	}

	ngOnDestroy() {
		if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
		if (this.expenseSubscription) this.expenseSubscription.unsubscribe();
	}
}
