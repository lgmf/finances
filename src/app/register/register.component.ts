import { Component, OnInit } from '@angular/core';
import { NgModel, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { User } from '../user';

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

  constructor(
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
    if (this.registerForm.invalid) return;
    this.showProgress = true;

    var timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.showProgress = false;
        resolve();
      }, 1500);
    });
    
    timeout.then(() => { toast('Cadastrado com sucesso', 2000) });
  }
}
