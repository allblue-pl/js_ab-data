import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";
import type { ABDData_Type } from "../abd-fields/ABDData.ts";
declare class ABDDataValidator extends ABDFieldValidator {
    get args(): ABDDataValidator_Args_Parsed;
    constructor(args: ABDDataValidator_Args);
    getType(): string;
    __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export default ABDDataValidator;
export type ABDDataValidator_Args_Raw = {
    type: ABDData_Type;
};
export type ABDDataValidator_Args = ABDFieldValidator_Args & ABDDataValidator_Args_Raw;
export type ABDDataValidator_Args_Parsed = ABDFieldValidator_Args_Parsed & ABDDataValidator_Args_Raw;
