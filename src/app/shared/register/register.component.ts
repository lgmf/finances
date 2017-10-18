import { Component, OnInit } from '@angular/core';
import { NgModel, FormGroup, FormBuilder } from '@angular/forms';

import { User } from '../../login/user.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: User = new User();
  showProgress: boolean = false;
  confirmPassword: string;

  constructor(
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: [null],
      email: [null],
      password: [null],
      confirmPassword: [null]
    })
  }

  createUser() {
    this.showProgress = true;
    if (this.registerForm.value.password !== this.user.Password) {
      toast("Passwords dont match", 2000);
      return;
    }
    this
      .afAuth
      .auth
      .createUserWithEmailAndPassword(this.user.Email, this.user.Password)
      .then((rs) => {
        var message = rs.message;
        this.
          afAuth
          .auth
          .currentUser
          .updateProfile({ displayName: this.user.Name, photoURL: null })
          .then((rs) => {
            this.showProgress = false;
            toast(message, 2000);
          })
          .catch((error) => {
            this.showProgress = false;
            toast(error.message, 2000);
          })

      })
      .catch((error) => {
        this.showProgress = false;
        toast(error.message, 2000);
      })
  }
}
