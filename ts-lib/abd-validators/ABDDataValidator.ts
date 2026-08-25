import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
import type { ABDData_Type } from "../abd-fields/ABDData.ts";
import helper from "../helper.ts";
import ABDData from "../abd-fields/ABDData.ts";

class ABDDataValidator extends ABDFieldValidator {
    override get args(): ABDDataValidator_Args_Parsed {
        return super.args as ABDDataValidator_Args_Parsed;
    }


    constructor(args: ABDDataValidator_Args) {
        super(args);
    }

    getType(): string {
        return 'Data';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        if (!ts0.assertType(value, ts0.TPreset({
            value: ts0.TRawValue,
                }))) {
            validator.fieldError(fieldName, abText.$(
                    'abData.Errors_WrongDataFieldFormat'));
        }

        let DataDBStr_Length = ABDData.Escape(value).length;
        if (DataDBStr_Length >= ABDData.TypeSizes[this.args.type])
            validator.fieldError(fieldName, "Escaped Data too long.");
    }

}
export default ABDDataValidator;

export type ABDDataValidator_Args_Raw = {
    type: ABDData_Type,
};
export type ABDDataValidator_Args = ABDFieldValidator_Args & 
        ABDDataValidator_Args_Raw;
export type ABDDataValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & 
        ABDDataValidator_Args_Raw;