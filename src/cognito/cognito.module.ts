import { NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from '../common/common.module';
// import { AppConfig } from './app.config';
// import { AuthHttp } from './authHttp.service';
// import { IDocument, IDocumentResult } from './document.inteface';
// import { i18nModule } from './i18n/i18n.module';
// import { SecurityModule } from './security/security.module';
// import { ValidatorModule } from './validators/validator.module';
import { ICognitoException, CognitoService } from './cognito.service';

// export * from './app.config';
// export * from './document.inteface';
// export * from '../common/user/user';
// export * from './module-import-guard';
// export * from './security/security.config';
// export * from './security/security.service';
// export * from './validators/validator.service';
export * from './cognito.service';

@NgModule({
    imports: [
        // i18nModule,
        // SecurityModule,
        // ValidatorModule
    ],
    exports: [
        // i18nModule,
        // SecurityModule,
        // ValidatorModule
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