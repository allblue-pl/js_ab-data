import abEnums from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";

class ABDEnumValidator extends ABDFieldValidator {
    override get args(): ABDEnumValidator_Args_Parsed {
        return super.args as ABDEnumValidator_Args_Parsed;
    }


    constructor(args: ABDEnumValidator_Args) {
        if (args.values === undefined)
            args.values = [];

        super(args);
    }

    getType(): string {
        return 'Enum';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        value = String(value);

        if (value === '') {
            if (this.args.required)
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        } else {
            if (this.args.values !== undefined) {
                if (!this.args.values.includes) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.Errors_NotInValues', 
                            [ this.args.values.join(", ") ] ));
                }
            }
        }
    }
}
export default ABDEnumValidator;

export type ABDEnumValidator_Args_Raw = {
    values?: Array<string>,
};
export type ABDEnumValidator_Args = ABDFieldValidator_Args &
        ABDEnumValidator_Args_Raw;
export type ABDEnumValidator_Args_Parsed = ABDFieldValidator_Args_Parsed &
        ABDEnumValidator_Args_Raw;