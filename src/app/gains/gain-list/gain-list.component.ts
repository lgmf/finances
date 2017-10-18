import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { toast } from 'angular2-materialize';
import { Gain } from '../shared/gain.model';
import { User } from '../../core/model/user.model';

@Component({
	selector: 'app-gain-list',
	templateUrl: './gain-list.component.html',
	styleUrls: ['./gain-list.component.css']
})
export class GainListComponent implements OnInit, OnDestroy {

	getlistSubscription: Subscription;

	currentUser: User = (localStorage.currentUser) ? JSON.parse(localStorage.currentUser) : new User();

	gains: Gain[] = [];
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
		this.getlistSubscription = this.db.list<Gain>(`${this.currentUser.uid}/gains`).valueChanges().subscribe((rs: Gain[]) => {
			this.gains = rs;
			this.showProgress = false;
		});
	}

	removeGain(evt, gain): void {
		evt.preventDefault();
		if (!confirm(`Are you sure you want to delete "${gain.Name}" ?`)) return;

		this
			.db
			.object(`${this.currentUser.uid}/gains/${gain.Identifier}`)
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

	ngOnDestroy(): void {
		if (this.getlistSubscription) this.getlistSubscription.unsubscribe();
	}

}
