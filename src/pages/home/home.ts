import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

import { ICognitoException, ICognitoCredentials, CognitoException, CognitoService } from '../../common/common.module';
import { LoginPage } from '../login/login';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  attributes: Array<CognitoUserAttribute> = [];

  constructor(private cognitoService: CognitoService,
              public navCtrl: NavController) {

  }

  ionViewDidLoad() {

     this.cognitoService.cognitoUser.getUserAttributes((err: Error, result:any[]) => {
       if (err) {
         let exception:ICognitoException = new CognitoException(err);
         console.log('error getting attributes', exception);
       }
       this.attributes = result;
       console.log('attributes', this.attributes);
     });
  }

  signOut() {
    this.cognitoService.signOut();
    this.navCtrl.setRoot(WelcomePage);
  }

}
