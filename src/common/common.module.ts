import { NgModule, Optional, SkipSelf } from '@angular/core';


// import { AppConfig } from './app.config';
// import { AuthHttp } from './authHttp.service';
// import { IDocument, IDocumentResult } from './document.inteface';
import { throwIfAlreadyLoaded } from './module-import-guard';
// import { i18nModule } from './i18n/i18n.module';
// import { SecurityModule } from './security/security.module';
import { CognitoModule } from '../cognito/cognito.module';
import { ValidatorModule } from './validators/validator.module';

// export * from './app.config';
// export * from './document.inteface';
// export * from '../common/user/user';
export * from './module-import-guard';
// export * from './security/security.config';
// export * from './security/security.service';
export * from '../cognito/cognito.service';
export * from './validators/validator.service';

@NgModule({
    imports: [
        // i18nModule,
        // SecurityModule,
        CognitoModule,
        ValidatorModule
    ],
    exports: [
        // i18nModule,
        // SecurityModule,
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