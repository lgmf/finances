import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { toast } from 'angular2-materialize';
import { Gain } from '../shared/gain.model';
import { User } from '../../login/user.model';

@Component({
	selector: 'app-gain',
	templateUrl: './gain.component.html',
	styleUrls: ['./gain.component.css']
})
export class GainComponent implements OnInit, OnDestroy {

	paramsSubscription: Subscription;
	gainSubscription: Subscription;
	newGainForm: FormGroup;
	gain: Gain = new Gain("", "New Gain", 0);
	currentUser: User = (localStorage.currentUser) ? JSON.parse(localStorage.currentUser) : new User();

	showProgress: boolean = false;

	constructor(
		public db: AngularFireDatabase,
		public formBuilder: FormBuilder,
		public router: Router,
		public route: ActivatedRoute
	) { }

	ngOnInit() {
		this.newGainForm = this.formBuilder.group({
			name: [null],
			value: [null]
		})
		this.paramsSubscription = this.route.params.subscribe(params => {
			if (params['key']) {
				this.gainSubscription = this.db.object<Gain>(`${this.currentUser.uid}/gains/${params['key']}`).valueChanges().subscribe((gain: Gain) => {
					this.gain = {
						Identifier: params['key'],
						Name: gain.Name,
						Value: gain.Value
					}
				});
			}
		});
	}

	saveGain(): void {

		if (this.newGainForm.invalid) return;

		if (this.gain.Identifier !== "") {
			this.updateGain();
			return;
		}

		this.showProgress = true;
		this
			.db
			.list<Gain>(`${this.currentUser.uid}/gains`)
			.push(this.gain)
			.then(rs => {
				this
					.db
					.object(`${this.currentUser.uid}/gains/${rs.key}`)
					.update({ Identifier: rs.key })
					.then(rs => {
						this.showProgress = false;
						this.router.navigateByUrl(`/gains`);
					}, error => {
						this.showProgress = false;
						toast(error.message, 2500)
					})
			}, error => {
				this.showProgress = false;
				toast(error.message, 2500)
			})
	}

	updateGain() {
		if (!this.gain) return;

		this.showProgress = true;
		this
			.db
			.object(`${this.currentUser.uid}/gains/${this.gain.Identifier}`)
			.update({
				Identifier: this.gain.Identifier,
				Name: this.gain.Name,
				Value: this.gain.Value
			})
			.then(rs => {
				this.showProgress = false;
				toast(rs, 2500)
				this.router.navigateByUrl(`/gains`);
			})
			.catch(error => {
				this.showProgress = false;
				toast(error.message, 2500)
			})
	}

	ngOnDestroy(): void {
		if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
		if (this.gainSubscription) this.gainSubscription.unsubscribe();
	}

}
