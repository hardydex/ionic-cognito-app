# Mobile Ionic Authenticaton App using AWS Cognito

### Quicklinks
  - [AWS Console](https://aws.amazon.com/cognito/?nc2=h_l3_ms)
  - [Ionic](http://ionicframework.com/)
  - [Angular](https://angular.io)

### Architecture Overview

Ionic is a popular Javascript framework that leverages [Angular](https://angular.io/) and [Apache Cordova](https://cordova.apache.org/) to run hybrid apps on mobile devices. The app will allow users to sign-up, confirm/verify email and login to gain access to authorized AWS resources.

AWS Services used:
* Amazon Cognito User Pools
* Amazon Cognito Federated Identities

#### Prerequisites:

* [AWS Account](https://aws.amazon.com/mobile/details/)
* [NodeJS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/getting-started/installing-node)
* [Ionic CLI](https://ionicframework.com/docs/cli/)

### Backend setup

1. Create or Sign In to your AWS Cognito environment
2. Create an AWS Cognito User Pool
3. Create an AWS Federated Identity Pool
4. Edit the AWS Federated Identity Pool, adding the AWS Cognito User Pool created in step 2(above).
5. Add an App Client to the AWS Cognito User Pool created in step 2(above). Note: Make sure to uncheck the checkbox "Generate client     secret".

### Ionic app setup
1. Clone this repo: 'git clone https://github.com/hardydex/ionic-cognito-app'
2. Open the congito.config.ts file; Add the informaion for the following:
   * region: 'your-region',
   * userPoolId: 'your-region_1gfVMWz3c',
   * appId: 'your-app-id',
   * idpUrl: 'cognito-idp.your-region.amazonaws.com',
   * identityPoolId: 'your-region:guid-of-the-identityPool'
3. Open a bash shell and navigate to the project folder.
4. Then run.
```bash
$ sudo npm install
```
Then, to run it, and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac. Note: you can also substitute ios for browser if you want to run the application in a browser:
```bash
$ ionic serve --browser -yourbrowserofchoice
```

