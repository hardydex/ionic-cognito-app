import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { ValidatorService } from '../../common/common.module';
import 'rxjs/Rx';
import { ICognitoException, ICognitoCredentials, CognitoService } from '../../common/common.module';
import { HomePage } from '../home/home';
import { SignupconfirmPage } from '../signupconfirm/signupconfirm';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  submitAttempt: boolean = false;
  public signupForm: FormGroup;

  constructor(private cognitoService: CognitoService,
              private fb: FormBuilder,
              private loadingController: LoadingController,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private toastController: ToastController) {

                this.buildForm();
  }

  buildForm() {
    this.signupForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      password: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, ValidatorService.ValidateEmail])],
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SignupPage');
  }

  signUp() {
    this.submitAttempt = true;

    if (this.signupForm.valid) {
      let creds: ICognitoCredentials = { username: this.signupForm.get('username').value, password: this.signupForm.get('password').value, email: this.signupForm.get('email').value };

      let loader = this.loadingController.create({
        showBackdrop: false,
        spinner: 'dots'
      });

      loader.present()
      .then(() => {
        this.cognitoService.signUp(creds)
          .then((data) => {
            console.log(`user data returned successful`,data);

            this.cognitoService.signIn(creds)
              .then((user)=> {
                this.navCtrl.push(HomePage);
              }).catch((err:ICognitoException) => {
                loader.dismiss();
                console.log('signIn error happened..', err);
                if (err.code === 'UserNotConfirmedException') {
                  this.navCtrl.push(SignupconfirmPage);
                }
              });
          }).catch((err: ICognitoException)=> {
            console.log(`error happened`,err);
            let toast = this.toastController.create({
              message: err.message,
              duration: 5000,
              position: 'bottom'
            });

            toast.present();
            loader.dismiss();
          })
      }, (() => {
        loader.dismiss();
      })); 
    } 

  }

}
