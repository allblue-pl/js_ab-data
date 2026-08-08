import { type TS0RawValue } from "@allblue/ts0";
import abText from "ab-text";
import type Validator from "../Validator.ts";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";

class ABDBlobValidator extends ABDFieldValidator {
    override get args(): ABDBlobValidator_Args_Parsed {
        return super.args as ABDBlobValidator_Args_Parsed;
    }


    constructor(args: ABDBlobValidator_Args) {
        super(args);
    }

    getType(): string {
        return 'Blob';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        if (String(value).length === 0) {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        }

        if (String(value).length >= this.args.maxLength)
            validator.fieldError(fieldName, "Blob too big.");
    }
}
export default ABDBlobValidator;

export type ABDBlobValidator_Args_Raw = {
    maxLength: number,
};
export type ABDBlobValidator_Args = ABDFieldValidator_Args & 
        ABDBlobValidator_Args_Raw;
export type ABDBlobValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & 
        ABDBlobValidator_Args_Raw