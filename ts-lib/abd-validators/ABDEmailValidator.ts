import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";

class ABDEmailValidator extends ABDFieldValidator {
    override get args(): ABDEmailValidator_Args_Parsed {
        return super.args as ABDEmailValidator_Args_Parsed;
    }


    constructor(args: ABDEmailValidator_Args) {
        super(args);
    }

    getType(): string {
        return 'Email';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        if (value === '') {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        } 

        let re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!re.test(String(value).toLowerCase()))
            validator.fieldError(fieldName, abText.$('abData.NotSet'));
    }

}
export default ABDEmailValidator;

export type ABDEmailValidator_Args = ABDFieldValidator_Args;
export type ABDEmailValidator_Args_Parsed = ABDFieldValidator_Args_Parsed;