import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDEmailValidator extends ABDFieldValidator {
    get args(): ABDEmailValidator_Args_Parsed;
    constructor(args: ABDEmailValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDEmailValidator;
export type ABDEmailValidator_Args = ABDFieldValidator_Args;
export type ABDEmailValidator_Args_Parsed = ABDFieldValidator_Args_Parsed;
