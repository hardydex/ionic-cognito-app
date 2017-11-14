import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import 'rxjs/Rx';
import { ICognitoException, ICognitoCredentials, CognitoService } from '../../common/common.module';
import { HomePage } from '../home/home';
import { SignupconfirmPage } from '../signupconfirm/signupconfirm';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  submitAttempt: boolean = false;
  public loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private cognitoService: CognitoService,
              private loadingController: LoadingController,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private toastController: ToastController) {

                this.buildForm();             
  }

  buildForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    
  }

  login() {
    this.submitAttempt = true;

    if (this.loginForm.valid) {
      let loader = this.loadingController.create({
        showBackdrop: false,
        spinner: 'dots'
      });

      loader.present()
        .then(() => {
          this.cognitoService.signIn(this.loginForm.value)
          .then((data) => {
            // console.log(`user data returned successful`,data);
            this.loginForm.reset();
            loader.dismiss();
            this.navCtrl.setRoot(HomePage);
          }).catch((err: ICognitoException)=> {
            console.log(`error happened`,err);
            if (err.code === 'UserNotConfirmedException') {
              loader.dismiss();
              this.navCtrl.push(SignupconfirmPage);
            } else {
              let toast = this.toastController.create({
                message: err.message,
                duration: 5000,
                position: 'bottom'
              });

              toast.present();
              loader.dismiss();
          }})
        }, (() => {
          loader.dismiss();
        }));   
    }
  }

}
