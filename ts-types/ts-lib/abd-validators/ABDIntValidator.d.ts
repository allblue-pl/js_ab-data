import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDIntValidator extends ABDFieldValidator {
    get args(): ABDIntValidator_Args_Parsed;
    constructor(args: ABDIntValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDIntValidator;
export type ABDIntValidator_Args_Raw = {
    minValue?: number;
    maxValue?: number;
};
export type ABDIntValidator_Args = ABDFieldValidator_Args & ABDIntValidator_Args_Raw;
export type ABDIntValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDIntValidator_Args_Raw;
