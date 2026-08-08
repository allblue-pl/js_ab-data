import { type TS0RawValue } from "@allblue/ts0";
import type Validator from "../Validator.ts";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
declare class ABDBlobValidator extends ABDFieldValidator {
    get args(): ABDBlobValidator_Args_Parsed;
    constructor(args: ABDBlobValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDBlobValidator;
export type ABDBlobValidator_Args_Raw = {
    maxLength: number;
};
export type ABDBlobValidator_Args = ABDFieldValidator_Args & ABDBlobValidator_Args_Raw;
export type ABDBlobValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDBlobValidator_Args_Raw;
