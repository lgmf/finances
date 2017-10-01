import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  showProgress: boolean = false;
  items: number[];
  auth: Subscription;
  getlist: Subscription;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.showProgress = true;
    this.auth = this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl('login')
        return;
      }
      this.getlist = this.db.list(`${user.uid}`).subscribe(rs => {
        this.items = rs
        this.showProgress = false;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.auth) this.auth.unsubscribe();
    if (this.getlist) this.getlist.unsubscribe();
  }
}
