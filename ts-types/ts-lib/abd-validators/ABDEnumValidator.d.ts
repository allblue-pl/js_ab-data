import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDEnumValidator extends ABDFieldValidator {
    get args(): ABDEnumValidator_Args_Parsed;
    constructor(args: ABDEnumValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDEnumValidator;
export type ABDEnumValidator_Args_Raw = {
    values?: Array<string>;
};
export type ABDEnumValidator_Args = ABDFieldValidator_Args & ABDEnumValidator_Args_Raw;
export type ABDEnumValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDEnumValidator_Args_Raw;
