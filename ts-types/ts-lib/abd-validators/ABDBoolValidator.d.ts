import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDBoolValidator extends ABDFieldValidator {
    get args(): ABDBoolValidator_Args_Parsed;
    constructor(args: ABDBoolValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDBoolValidator;
export type ABDBoolValidator_Args = ABDFieldValidator_Args;
export type ABDBoolValidator_Args_Parsed = ABDFieldValidator_Args_Parsed;
