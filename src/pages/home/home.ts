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

    //#region Remove 
    /* this.cognitoService.getCredentials().subscribe(creds => {
      // let exception: ICognitoException 
       this.cognitoService.cognitoUser['getUserAttributes']((err: Error, result: CognitoUserAttribute[]) => {
         if (err) { return console.log('error getting attributes', err);}
         this.attributes = result;
       })
     }); */
     //#endregion

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
