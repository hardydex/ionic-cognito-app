import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ICognitoException, CognitoService, CognitoException } from '../../common/common.module';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-signupconfirm',
  templateUrl: 'signupconfirm.html',
})
export class SignupconfirmPage {

  submitAttempt: boolean = false;
  public confirmForm: FormGroup;

  constructor(private cognitoService: CognitoService,
              private fb: FormBuilder,
              private loadingController: LoadingController,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private toastController: ToastController) {

                this.buildForm();
  }

  buildForm() {
    this.confirmForm = this.fb.group({
      confirmationCode: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SignupconfirmPage');
  }

  confirm () {
    this.submitAttempt = true;

    if (this.confirmForm.valid) {

      let loader = this.loadingController.create({
        showBackdrop: false,
        spinner: 'dots'
      });

      loader.present()
      .then(() => {
        this.cognitoService.confirmRegistration(this.confirmForm.get('confirmationCode').value)
          .then((data) => {
            console.log(`confirm registration data returned successful`,data);
            console.log('username', this.cognitoService.cognitoUser.getUsername());
            loader.dismiss();
            this.navCtrl.push(LoginPage);

          }).catch((err: ICognitoException)=> {
            console.log(`error happened`,err);
            console.log('username', this.cognitoService.cognitoUser.getUsername());
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

  resend() {
    let toast = this.toastController.create({
      duration: 5000,
      position: 'bottom'
    });
    this.cognitoService.resendConfirmationCode()
      .then((result) => {
        console.log('confirmation code resent');
        toast.setMessage('confirmation code resent');
        toast.present();
      }).catch((err) => {
        let exception: ICognitoException = new CognitoException(err);
        console.log('oops something went wrong sending confirmation code',exception);
        toast.setMessage(exception.message);
        toast.present();
      });
  }

}
