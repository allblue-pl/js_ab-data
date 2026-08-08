import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
import type { ABDJSON_Type } from "../abd-fields/ABDJSON.ts";
import helper from "../helper.ts";
import ABDJSON from "../abd-fields/ABDJSON.ts";

class ABDJSONValidator extends ABDFieldValidator {
    override get args(): ABDJSONValidator_Args_Parsed {
        return super.args as ABDJSONValidator_Args_Parsed;
    }


    constructor(args: ABDJSONValidator_Args) {
        super(args);
    }

    getType(): string {
        return 'JSON';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        if (!ts0.assertType(value, ts0.TPreset({
            value: ts0.TRawObject,
                }))) {
            validator.fieldError(fieldName, abText.$(
                    'abData.Errors_WrongJSONFieldFormat'));
        }

        let jsonDBStr_Length = ABDJSON.Escape(value).length;
        if (jsonDBStr_Length >= ABDJSON.TypeSizes[this.args.type])
            validator.fieldError(fieldName, "Escaped json too long.");
    }

}
export default ABDJSONValidator;

export type ABDJSONValidator_Args_Raw = {
    type: ABDJSON_Type,
};
export type ABDJSONValidator_Args = ABDFieldValidator_Args & 
        ABDJSONValidator_Args_Raw;
export type ABDJSONValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & 
        ABDJSONValidator_Args_Raw;