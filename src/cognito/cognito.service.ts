import { Injectable, Optional, SkipSelf } from '@angular/core';

import * as AWS from 'aws-sdk';
import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails , ICognitoUserPoolData , CognitoUserSession } from 'amazon-cognito-identity-js';

import { CognitoConfig } from './cognito.config';
import { Subject, Observable } from 'rxjs';
import { Credentials } from 'aws-sdk/lib/credentials';

export interface ICognitoCredentials {
    email?: string;
    username: string;
    password: string;
}

export interface ICognitoException {
    code: string;
    message: string;
    requestId: string;
    retryDelay: number;
    retryable: boolean;
    statusCode: number;
    time: Date;
}

export class CognitoException implements ICognitoException {
    code: string;
    message: string;
    requestId: string;
    retryDelay: number;
    retryable: boolean;
    statusCode: number;
    time: Date;

    constructor(values:Object = {}){
        Object.assign(this, values);
    }
}

@Injectable()
export class CognitoService {

    private config = CognitoConfig;
    private poolData: ICognitoUserPoolData;
    private userPool: CognitoUserPool;
    private unauthCreds: AWS.CognitoIdentityCredentials;
    public cognitoUser: CognitoUser;
    private session: CognitoUserSession;
    private signInSubject: Subject<string> = new Subject<string>();
    private signOutSubject: Subject<string> = new Subject<string>();

    constructor(@Optional() @SkipSelf() prior: CognitoService){
        if (prior){
            return prior;
        }
        AWS.config.region = this.config.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.config.identityPoolId
        });
        this.poolData = { UserPoolId: this.config.userPoolId, ClientId: this.config.appId };
        this.userPool = new CognitoUserPool(this.poolData);
    }

    private authDetails(creds: ICognitoCredentials): AuthenticationDetails {
        return new AuthenticationDetails({ Username: creds.username, Password: creds.password });
    }

    private buildAttributes(creds: ICognitoCredentials) : Array<CognitoUserAttribute> {
        let attributeList: CognitoUserAttribute[];
        let attributeEmail = new CognitoUserAttribute({Name: 'email', Value: creds.email});
        let attributeName = new CognitoUserAttribute({ Name: 'preferred_username', Value: creds.username });
        attributeList.push(attributeEmail);
        attributeList.push(attributeName);
        return attributeList;
    }

    private buildCreds() {
        let self = this;
        let json = self.buildLogins(self.session.getIdToken().getJwtToken());
        return new AWS.CognitoIdentityCredentials(json);
    }

    private buildLogins(token) {
        let self = this;
        let key = `${self.config.idpUrl}/${self.config.userPoolId}`;
        let json = { IdentityPoolId: self.config.identityPoolId, Logins: {}};
        json.Logins[key] = token;
        return json;
    }

    confirmRegistration(code:string) {
        let self = this;

        let userData = {
            Username: self.cognitoUser.getUsername(),
            Pool: self.userPool
        };

        let cognitoUser = new CognitoUser(userData);

        return new Promise((resolve,reject) => {
            try {       
                cognitoUser.confirmRegistration(code,true,(err,result) => {
                    if (err) {
                        let exception: ICognitoException = new CognitoException(err);
                        console.log('error occurred while confirming registration code', exception);
                        reject(exception);
                    } else {
                        console.log('confirm registration successful', result);
                        resolve(result);
                    }
                });
            } catch (error) {
                let exception: ICognitoException = new CognitoException(error);
                reject(error);
            }
        });
    }

    resendConfirmationCode() {
        let self = this;
        
        let userData = {
            Username: self.cognitoUser.getUsername(),
            Pool: self.userPool
        };

        let cognitoUser = new CognitoUser(userData);

        return new Promise((resolve,reject) => {
            try {       
                cognitoUser.resendConfirmationCode((err,result) => {
                    if (err) {
                        let exception: ICognitoException = new CognitoException(err);
                        console.log('error occurred while confirming registration code', exception);
                        reject(exception);
                    } else {
                        console.log('confirm registration successful', result);
                        resolve(result);
                    }
                });
            } catch (error) {
                let exception: ICognitoException = new CognitoException(error);
                reject(error);
            }
        });
    }

    private getAWSCredentials(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                (AWS.config.credentials as AWS.Credentials).get((err) => {
                    if (err) {return reject(err);}
                    console.log({'aws_credentials': AWS.config.credentials});
                    resolve(AWS.config.credentials)
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    getCredentials(): Observable<any> {
        let result = null;
        if (this.cognitoUser === null) {
            result = this.getAWSCredentials();
        } else if (this.session && this.session.isValid()){
            result = this.getAWSCredentials();
        } else {
            result = this.refreshSession().
                then(this.getAWSCredentials)
        }
        return Observable.from(result);
    }

    private getCognitoUser(creds: ICognitoCredentials): CognitoUser {
        let self = this;
        let _cognitoUser: CognitoUser = new CognitoUser({ Username: creds.username, Pool: self.userPool });
        self.cognitoUser = _cognitoUser;
        return _cognitoUser;
    }

    private handleError(error: any, caller:string) {
        let exception: ICognitoException = new CognitoException(error);
        console.error(`AWS Cognito Service::handleError callerMethod::${caller}`, exception);
        return exception;
    }

    private refreshOrResetCreds() {
        let self = this;
        self.cognitoUser = self.userPool.getCurrentUser();

        if (self.cognitoUser !== null) {
            self.refreshSession();
        } else {
            self.resetCreds();
        }
    }

    private refreshSession(): Promise<CognitoUserSession> {
        let self = this;
        return new Promise((resolve, reject) => {
            self.cognitoUser.getSession((err, session:CognitoUserSession)=> {
                if (err) {
                    let exception: ICognitoException = new CognitoException(err);
                    console.log('error refreshing user session', err);
                    reject(err);
                }
                // Link user pool identity to federated pool identity //
                AWS.config.credentials = new AWS.CognitoIdentityCredentials(self.buildLogins(session.getAccessToken().getJwtToken()));
                console.log(`${new Date()} - refreshed session for ${self.cognitoUser.getUsername()}. Valid?: `, session.isValid());
                self.saveCreds(session);
                resolve(session);
            });
        });
    }

    private resetCreds(clearCache:boolean = false) {
        console.log('resetting credentials for unauth access');
        this.cognitoUser = null;
        this.unauthCreds = this.unauthCreds || new AWS.CognitoIdentityCredentials({ IdentityPoolId: this.config.identityPoolId });

        if (clearCache) {
            this.unauthCreds.clearCachedId();
        }
        this.setCredentials(this.unauthCreds);
    }

    private saveCreds(session: CognitoUserSession, cognitoUser?: CognitoUser){
        let self = this;

        if (session != null) {
            self.session = session;
        }

        if (cognitoUser) {
            self.cognitoUser = cognitoUser;
        }

        self.setCredentials(self.buildCreds());

    }

    private setCredentials(creds:AWS.CognitoIdentityCredentials) {
        AWS.config.credentials = creds;
    }

    signIn(creds:ICognitoCredentials): Promise<CognitoUser> {
        let self = this;

        self.cognitoUser = self.getCognitoUser(creds);
        console.log('cognitoUser', self.cognitoUser);
        
        return new Promise((resolve, reject) => {
            try {

                self.cognitoUser.authenticateUser(self.authDetails(creds), {
                    newPasswordRequired: (userAttributes,requiredAttributes) => {
                        console.log('user atttributes',{ userAttributes: userAttributes, requiredAttributes: requiredAttributes});
                        
                        self.cognitoUser.completeNewPasswordChallenge(creds.password,requiredAttributes, {
                            onSuccess: (session: CognitoUserSession) => {

                                self.refreshSession()
                                    .then((session) => {
                                        if (session != null){
                                            self.saveCreds(session, self.cognitoUser);
                                            self.signInSubject.next(self.cognitoUser.getUsername());
                                            resolve(self.cognitoUser);
                                        }
                                    }).catch((err) => {
                                        reject(this.handleError(err,'refreshSession'));
                                    });
                                
                            }, onFailure: (err:any) => {
                                console.log('error occurred completing the challenge..',err);
                                reject(this.handleError(err,'completeNewPasswordChallenge'));
                            }
                        });
                    },
                    mfaRequired: (challangeName, challengeParameters) => {},
                    customChallenge: (challangeParameters) => {},
                    onSuccess: (session: CognitoUserSession) => {

                        self.refreshSession()
                        .then((session) => {
                            if (session != null){
                                self.saveCreds(session, self.cognitoUser);
                                self.signInSubject.next(self.cognitoUser.getUsername());
                                resolve(self.cognitoUser);
                            }
                        }).catch((err) => {
                            reject(this.handleError(err,'refreshSession'));
                        });
                    },
                    onFailure: (err: any) => {
                        reject(this.handleError(err,'password signin'));
                    },
                })
                
            } catch (error) {
                console.log('try error reached...',error);
                reject(this.handleError(error,'catch/try authenticateUser'));
            }
        });
    }

    signOut() {
        if (this.cognitoUser) {
            console.log('logging out...');
            let _username = this.cognitoUser.getUsername();
            this.cognitoUser['signOut']();
            this.resetCreds(true);
            this.signOutSubject.next(_username);
        }
    }

    signUp(creds:ICognitoCredentials):Promise<CognitoUser> {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                let attributes:CognitoUserAttribute[] = [];
                let attributeEmail = new CognitoUserAttribute({Name: 'email', Value: creds.email});
                let attributeName = new CognitoUserAttribute({ Name: 'preferred_username', Value: creds.username });

                attributes.push(attributeEmail);
                attributes.push(attributeName);

                self.userPool.signUp(creds.username,creds.password,attributes,null,(err:Error,result) => {
                    if (err){ return reject(err);}
                    console.log('registration result',result);
                    console.log('user id',result.userSub);
                    resolve(result.user);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}