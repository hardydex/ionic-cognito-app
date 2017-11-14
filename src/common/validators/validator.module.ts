import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '../module-import-guard';

import { EqualValidator } from './equal-validator.directive';
import { ValidatorService } from './validator.service';

export * from './validator.service';

@NgModule({
     imports: [
    ],
    declarations: [
        EqualValidator
    ],
    exports: [
        EqualValidator
    ],
    providers: [
        ValidatorService
    ]
})
export class ValidatorModule {
    constructor( @Optional() @SkipSelf() parentModule: ValidatorModule) {
        throwIfAlreadyLoaded(parentModule, 'ValidatorModule');
    }
}
