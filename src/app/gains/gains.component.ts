import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import * as $ from 'jquery';
import { toast } from 'angular2-materialize';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gains',
  templateUrl: './gains.component.html',
  styleUrls: ['./gains.component.css']
})
export class GainsComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  getlistSubscription: Subscription;

  gains: number[] = [];
  currentUserUID: string = "";
  showProgress: boolean = true;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.authSubscription = this.afAuth.authState.subscribe(user => {
      this.currentUserUID = user.uid;
      this.getlistSubscription = this.db.list(`${this.currentUserUID}/gains`).subscribe(rs => {
        this.gains = rs
        this.showProgress = false;
      });
    });
  }

  removeGain(evt, gain): void {
    evt.preventDefault();
    if (!confirm(`Are you sure you want to delete "${gain.Name}" ?`)) return;

    this
      .db
      .object(`${this.currentUserUID}/gains/${gain.$key}`)
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
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.getlistSubscription) this.getlistSubscription.unsubscribe();
  }

}
