import abText from "ab-text";
import ts0, { ts0Helper, ts0Virtual, type TS0RawObject, type TS0RawValue } from "@allblue/ts0"
import Validator from "../Validator.ts";

export default abstract class ABDFieldValidator {
    #args: ABDFieldValidator_Args_Parsed;

    get args(): ABDFieldValidator_Args_Parsed {
        return this.#args;
    }


    constructor(args_: ABDFieldValidator_Args) {
        this.#args = assert_ABDFieldValidator_Args(args_);
    }

    validate(validator: Validator, fieldName: string, value: TS0RawValue): void {
        if (value === null) {
            if (this.args.notNull) {
                if (this.args.required)
                    validator.fieldError(fieldName, abText.$('abData.NotSet'));
                else
                    validator.fieldError(fieldName, abText.$('abData.NotNull'));
            }
        } else
            this.__validate(validator, fieldName, value);
    }


    /* Bad design choices. */
    abstract getType(): string;
    abstract __validate(validator: Validator, fieldName: string, value: TS0RawValue): void;
}


export type ABDFieldValidator_Args = {
    notNull?: boolean,
    required?: boolean,
};
export type ABDFieldValidator_Args_Parsed = {
    notNull: boolean,
    required: boolean,
} & {[argName: string]: TS0RawValue}
const presets_ABDFieldValidator_Args_Parsed = ts0.TPreset({
    notNull: [ "boolean", ts0.TDefault(true) ],
    required: [ "boolean", ts0.TDefault(true) ],
}, ts0.TObject("string", ts0.TRawObject));
const assert_ABDFieldValidator_Args = (value: any): ABDFieldValidator_Args_Parsed => 
        ts0.assertType(value, presets_ABDFieldValidator_Args_Parsed);