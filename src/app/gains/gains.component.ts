import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-gains',
  templateUrl: './gains.component.html',
  styleUrls: ['./gains.component.css']
})
export class GainsComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  getlistSubscription: Subscription;

  showProgress: boolean = true;
  numbers: number[] = [];

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.authSubscription = this.afAuth.authState.subscribe(user => {
      console.log(`${user.uid}/gains`)
      this.getlistSubscription = this.db.list(`${user.uid}/gains`).subscribe(rs => {
        this.numbers = rs
        this.showProgress = false;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.getlistSubscription) this.getlistSubscription.unsubscribe();
  }

}
