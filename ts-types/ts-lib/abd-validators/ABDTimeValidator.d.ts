import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
declare class ABDTimeValidator extends ABDFieldValidator {
    get args(): ABDTimeValidator_Args_Parsed;
    constructor(args: ABDTimeValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDTimeValidator;
export type ABDTimeValidator_Args_Raw = {
    type?: 'dateTime' | 'date' | 'time';
    minDate?: number;
    maxDate?: number;
};
export type ABDTimeValidator_Args = ABDFieldValidator_Args & ABDTimeValidator_Args_Raw;
export type ABDTimeValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDTimeValidator_Args_Raw;
