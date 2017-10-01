import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [   
    AngularFireAuth
  ]
})
export class HeaderComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,    
    public router : Router
  ) { }

  ngOnInit() {
  }

  logout(): void {
    this.afAuth.auth.signOut().then(rs => {
      this.router.navigateByUrl(`login`);
    });
  }
}
