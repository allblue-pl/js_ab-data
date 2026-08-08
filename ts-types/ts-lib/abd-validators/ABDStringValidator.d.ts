import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDStringValidator extends ABDFieldValidator {
    get args(): ABDStringValidator_Args_Parsed;
    constructor(args: ABDStringValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDStringValidator;
export type ABDStringValidator_Args_Raw = {
    minLength?: number;
    maxLength?: number;
    regexp?: [string, string];
    trim?: boolean;
    chars?: string;
};
export type ABDStringValidator_Args = ABDFieldValidator_Args & ABDStringValidator_Args_Raw;
export type ABDStringValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDStringValidator_Args_Raw;
