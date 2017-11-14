import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class ValidatorService {

    constructor(@Optional() @SkipSelf() prior: ValidatorService) {
        if (prior) {
            // console.log('validator service already exists');
            return prior;
        } else {
            // console.log('created validator service');
        }
    }

    static ValidateEmail(c: AbstractControl) {
        // RFC 2822 compliant regex
        if (c.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static ValidatePhone(c: AbstractControl) {
        //if (c.value.match(/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/)) {
        let regEx = /^((\+\d{1,2}|1)[\s.-]?)?\(?[2-9](?!11)\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$|^$/;
        if (regEx.test(c.value)) {
            return null;
        } else {
            return { 'invalidPhoneNumber': true };
        }
    }
}