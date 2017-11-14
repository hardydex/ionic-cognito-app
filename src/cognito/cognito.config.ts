export interface ICognitoConfig {
    region: string;
    userPoolId: string;
    appId: string;
    idpUrl?: string;
    identityPoolId?: string;
}

export let CognitoConfig: ICognitoConfig = {
    region:'your-region',
    userPoolId: 'your-region_1gfVMWz3C',
    appId: 'your-app-id',
    idpUrl: `cognito-idp.your-region.amazonaws.com`,
    identityPoolId: 'us-east-1:7b7898c5-6b92-426b-8df0-31fc935fb627'
}
