import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";

class ABDLongValidator extends ABDFieldValidator {
    override get args(): ABDLongValidator_Args_Parsed {
        return super.args as ABDLongValidator_Args_Parsed;
    }


    constructor(args: ABDLongValidator_Args) {
        super(args);
    }

    getType(): string {
        return 'JSON';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        if (value === '') {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        }

        if (!this.args['required'] && value === '')
            return;

        if (isNaN(Number(value)))
            validator.fieldError(fieldName, abText.$('abData.Int_NotANumber'));
        else {
            let number = Number(value);            
            if (number % 1 !== 0)
                validator.fieldError(fieldName, abText.$('abData.Int_NotAnInt'));
            else {
                if (this.args.minValue !== undefined) {
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

}
export default ABDLongValidator;

export type ABDLongValidator_Args_Raw = {
    minValue?: number,
    maxValue?: number,
};
export type ABDLongValidator_Args = ABDFieldValidator_Args &
        ABDLongValidator_Args_Raw;
export type ABDLongValidator_Args_Parsed = ABDFieldValidator_Args_Parsed &
        ABDLongValidator_Args_Raw;