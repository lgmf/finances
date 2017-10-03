import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { User } from '../user';
import { toast } from 'angular2-materialize';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: Observable<firebase.User>;
  showProgress: boolean = false;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [(localStorage.email) ? localStorage.email : null],
      password: [null]
    })
  }

  login(): void {
    if (this.loginForm.invalid) return;

    this.showProgress = true;
    this
      .afAuth
      .auth
      .signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then(rs => {
        this.showProgress = false;
        localStorage.email = this.loginForm.value.email;
        this.router.navigateByUrl(`/home`);
      })
      .catch(error => {
        this.showProgress = false;
        toast(error.message, 2500)
      })
  }

  loginWithGoogle(): void {
    this.showProgress = true;
    this
      .afAuth
      .auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(rs => {
        this.showProgress = false;
        this.router.navigateByUrl(`/home/${rs.user.uid}`);
      })
      .catch(error => {
        this.showProgress = false;
        toast(error.message, 2500)
      })
  }

  resetPassword(): void {
    if (!confirm("Are you sure?")) return;

    this
      .afAuth
      .auth
      .sendPasswordResetEmail(this.loginForm.value.email)
      .then(rs => {
        console.log(rs);
        toast(`To complete accees the link on ${this.loginForm.value.email}`, 2500)
      })
      .catch(error => toast(error.message, 2500))
  }
}
