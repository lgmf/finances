import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  items: any[];
  subscription: Subscription;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.subscription = this.db.list('items/negatives').subscribe(rs => this.items = rs);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
