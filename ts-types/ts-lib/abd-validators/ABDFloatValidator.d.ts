import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDFloatValidator extends ABDFieldValidator {
    get args(): ABDFloatValidator_Args_Parsed;
    constructor(args: ABDFloatValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDFloatValidator;
export type ABDFloatValidator_Args_Raw = {
    minValue?: number;
    maxValue?: number;
};
export type ABDFloatValidator_Args = ABDFieldValidator_Args & ABDFloatValidator_Args_Raw;
export type ABDFloatValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDFloatValidator_Args_Raw;
