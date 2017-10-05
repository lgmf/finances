import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { toast } from 'angular2-materialize';
import { User } from '../user';
import { Gain } from '../gain';

@Component({
  selector: 'app-gains',
  templateUrl: './gains.component.html',
  styleUrls: ['./gains.component.css']
})
export class GainsComponent implements OnInit, OnDestroy {

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
    this.getlistSubscription = this.db.list(`${this.currentUser.uid}/gains`).subscribe(rs => {
      this.gains = rs
      this.showProgress = false;
    });
  }

  removeGain(evt, gain): void {
    evt.preventDefault();
    if (!confirm(`Are you sure you want to delete "${gain.Name}" ?`)) return;

    this
      .db
      .object(`${this.currentUser.uid}/gains/${gain.$key}`)
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
