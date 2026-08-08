import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";

class ABDFloatValidator extends ABDFieldValidator {
    override get args(): ABDFloatValidator_Args_Parsed {
        return super.args as ABDFloatValidator_Args_Parsed;
    }


    constructor(args: ABDFloatValidator_Args) {
        super(args);
    }

    getType(): string {
        return 'Float';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        if (value === '') {
            if (this.args.required)
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        }

        if (!this.args.required && value === '')
            return;

        if (isNaN(Number(value)))
            validator.fieldError(fieldName, abText.$('abData.Int_NotANumber'));
        else {
            let number = Number(value);
            if (this.args.minValue !== undefined) {
                this.args.minValue
                if (number < this.args.minValue) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.Int_BelowMin',  { minValue: String(this.args.minValue), }));
                }
            }

            if (this.args.maxValue !== undefined) {
                if (number > this.args.maxValue) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.Int_AboveMax', { maxValue: String(this.args.maxValue), }));
                }
            }
        }
    }

}
export default ABDFloatValidator;

export type ABDFloatValidator_Args_Raw = {
    minValue?: number,
    maxValue?: number,
};
export type ABDFloatValidator_Args = ABDFieldValidator_Args & 
        ABDFloatValidator_Args_Raw;
export type ABDFloatValidator_Args_Parsed = ABDFieldValidator_Args_Parsed &
        ABDFloatValidator_Args_Raw;