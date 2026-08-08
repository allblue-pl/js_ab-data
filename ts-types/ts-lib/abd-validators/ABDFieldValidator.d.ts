import { type TS0RawValue } from "@allblue/ts0";
import Validator from "../Validator.ts";
export default abstract class ABDFieldValidator {
    #private;
    get args(): ABDFieldValidator_Args_Parsed;
    constructor(args_: ABDFieldValidator_Args);
    validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
    abstract getType(): string;
    abstract __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}
export type ABDFieldValidator_Args = {
    notNull?: boolean;
    required?: boolean;
};
export type ABDFieldValidator_Args_Parsed = {
    notNull: boolean;
    required: boolean;
} & {
    [argName: string]: TS0RawValue;
};
