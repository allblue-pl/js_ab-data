import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
import type { ABDJSON_Type } from "../abd-fields/ABDJSON.ts";
declare class ABDJSONValidator extends ABDFieldValidator {
    get args(): ABDJSONValidator_Args_Parsed;
    constructor(args: ABDJSONValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDJSONValidator;
export type ABDJSONValidator_Args_Raw = {
    type: ABDJSON_Type;
};
export type ABDJSONValidator_Args = ABDFieldValidator_Args & ABDJSONValidator_Args_Raw;
export type ABDJSONValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDJSONValidator_Args_Raw;
