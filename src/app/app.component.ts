import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from './core/model/user.model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

	authSubscription: Subscription;

	constructor(
		public afAuth: AngularFireAuth,
		public router: Router
	) { }

	ngOnInit(): void {
		this.authSubscription = this.afAuth.authState.subscribe(user => {
			if (!user)
				return;
			let currentUser = new User(user.uid, user.displayName, user.email);
			localStorage.currentUser = JSON.stringify(currentUser);
			if (this.router.navigated)
				return;
			this.router.navigateByUrl(`/home`);
		})
	}

	ngOnDestroy(): void {
		this.authSubscription.unsubscribe();
	}

}
