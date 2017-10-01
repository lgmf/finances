import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.afAuth.authState;

    this.afAuth.authState.subscribe(user => {
      if (!user) return;      
      this.router.navigateByUrl(`/home/${user.uid}`);
    })
  }

  login() : void{
    alert('success');
  }

  loginWithGoogle(): void {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(rs => {
        this.router.navigateByUrl(`/home/${rs.user.uid}`);
      })
      .catch(err => {
        console.log(err);
      })

  }
}
