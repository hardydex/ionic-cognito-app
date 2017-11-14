import { NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from '../common/common.module';
import { ICognitoException, CognitoService } from './cognito.service';

export * from './cognito.service';

@NgModule({
    imports: [
    ],
    exports: [
    ],
    providers: [
        CognitoService
    ]
})
export class CognitoModule {
    constructor( @Optional() @SkipSelf() parentModule: CognitoModule) {
        throwIfAlreadyLoaded(parentModule, 'CognitoModule');
    }
}