import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";

class ABDBoolValidator extends ABDFieldValidator {
    override get args(): ABDBoolValidator_Args_Parsed {
        return super.args as ABDBoolValidator_Args_Parsed;
    }


    constructor(args: ABDBoolValidator_Args) {
        super(args);
    }

    getType(): string {
        return 'Bool';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        if (!value) {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotChecked'));
        }
    }
}
export default ABDBoolValidator;


export type ABDBoolValidator_Args = ABDFieldValidator_Args;
export type ABDBoolValidator_Args_Parsed = ABDFieldValidator_Args_Parsed;