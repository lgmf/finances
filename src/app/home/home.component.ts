import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  gainsSubscription: Subscription;

  today: string = new Date().toLocaleDateString();
  currentUser: User = new User();

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
    this.authSubscription = this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl('login')
        return;
      }
      this.currentUser.Name = user.displayName;
      this.gainsSubscription = this.db.list(`${user.uid}/gains`).subscribe(gains => {
        gains.forEach(g => {
          this.gains += g.Value;
        })
        this.showProgress = false;
      });
    });
  }

  getBalance(): number {
    return Math.round((this.expenses / this.gains) * 100);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.gainsSubscription) this.gainsSubscription.unsubscribe();
  }
}
