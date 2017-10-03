import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { toast } from 'angular2-materialize';
import { Gain } from '../gain';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-gains',
  templateUrl: './new-gains.component.html',
  styleUrls: ['./new-gains.component.css']
})
export class NewGainsComponent implements OnInit, OnDestroy {

  newGainForm: FormGroup;
  gain: Gain = new Gain("", "New Gain", 0);

  authSubscription: Subscription;
  paramsSubscription: Subscription;
  gainSubscription: Subscription;

  currentUserUID: string = "";
  showProgress: boolean = false;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.newGainForm = this.formBuilder.group({
      name: [null],
      value: [null]
    })
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.gain.$key = params['key'];
      this.authSubscription = this.afAuth.authState.subscribe(user => {
        this.currentUserUID = user.uid;
        if (this.gain.$key) {
          this.gainSubscription = this.db.object(`${this.currentUserUID}/gains/${this.gain.$key}`).subscribe(gain => {
            this.gain = gain;
          });
        }
      });
    });
  }

  saveGain(): void {

    if (this.newGainForm.invalid) return;

    if (this.gain) {
      this.updateGain();
      return;
    }

    this.showProgress = true;
    this
      .db
      .list(`${this.currentUserUID}/gains`)
      .push(this.gain)
      .then(rs => {
        this.showProgress = false;
        toast(rs.message, 2500)
        this.router.navigateByUrl(`/gains`);
      })
      .catch(error => {
        this.showProgress = false;
        toast(error.message, 2500)
      })
  }

  updateGain() {
    if (!this.gain) return;

    this.showProgress = true;
    this
      .db
      .object(`${this.currentUserUID}/gains/${this.gain.$key}`)
      .update({
        Name: this.gain.Name,
        Value: this.gain.Value
      })
      .then(rs => {
        this.showProgress = false;
        toast(rs, 2500)
        this.router.navigateByUrl(`/gains`);
      })
      .catch(error => {
        this.showProgress = false;
        toast(error.message, 2500)
      })
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
    if (this.gainSubscription) this.gainSubscription.unsubscribe();
  }

}
