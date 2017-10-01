import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    AngularFireDatabase
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  items: number[];
  subscription: Subscription;
 
  constructor(
    public db: AngularFireDatabase
  ) { }

  ngOnInit(): void {
    this.subscription = this.db.list('items/positives').subscribe(rs => this.items = rs);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
