import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter, NativeDateAdapter } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { toast } from 'angular2-materialize';
import { Expense } from '../shared/expense.model';
import { User } from '../../login/user.model';

@Component({
	selector: 'app-expense',
	templateUrl: './expense.component.html',
	styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit, OnDestroy {

	paramsSubscription: Subscription;
	expenseSubscription: Subscription;
	expenseForm: FormGroup;
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
		this.expenseForm = this.formBuilder.group({
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
		if (this.expenseForm.invalid) return;

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
				this
					.db
					.object(`${this.currentUser.uid}/expenses/${rs.key}`)
					.update({ Identifier: rs.key })
					.then(rs => {
						this.showProgress = false;						
						this.router.navigateByUrl(`/expenses`);
					})
					.catch(error => {
						this.showProgress = false;						
					})
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
