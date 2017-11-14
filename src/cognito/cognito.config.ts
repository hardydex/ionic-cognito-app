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
    identityPoolId: 'your-region:guid-of-the-identityPool'
}
