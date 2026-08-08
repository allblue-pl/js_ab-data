import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDLongValidator extends ABDFieldValidator {
    get args(): ABDLongValidator_Args_Parsed;
    constructor(args: ABDLongValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDLongValidator;
export type ABDLongValidator_Args_Raw = {
    minValue?: number;
    maxValue?: number;
};
export type ABDLongValidator_Args = ABDFieldValidator_Args & ABDLongValidator_Args_Raw;
export type ABDLongValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDLongValidator_Args_Raw;
