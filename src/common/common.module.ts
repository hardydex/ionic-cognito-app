import { NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { CognitoModule } from '../cognito/cognito.module';
import { ValidatorModule } from './validators/validator.module';

export * from './module-import-guard';
export * from '../cognito/cognito.service';
export * from './validators/validator.service';

@NgModule({
    imports: [
        CognitoModule,
        ValidatorModule
    ],
    exports: [
        CognitoModule,
        ValidatorModule
    ],
    providers: [

    ]
})
export class CommonModule {
    constructor( @Optional() @SkipSelf() parentModule: CommonModule) {
        throwIfAlreadyLoaded(parentModule, 'CommonModule');
    }
}