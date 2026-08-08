import { type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator from "./abd-validators/ABDFieldValidator.ts";
export default class Validator {
    #private;
    constructor();
    addField(fieldName: string, fieldValue: TS0RawValue): void;
    addFieldValidator(fieldName: string, fieldValidator: ABDFieldValidator): void;
    getFieldInfo(fieldName: string): ValidatorFieldInfo;
    getInfo(): ValidatorInfo;
    error(message: string): void;
    fieldError(fieldName: string, message: string): void;
    hasField(fieldName: string): boolean;
    isFieldValid(fieldName: string): boolean;
    isValid(): boolean;
}
export type ValidatorInfo = {
    valid: boolean;
    fields: {
        [fieldName: string]: ValidatorFieldInfo;
    };
    state: string;
    errors: Array<string>;
};
export type ValidatorFieldInfo = {
    valid: boolean;
    value: TS0RawValue;
    state: '';
    errors: Array<string>;
    warnings: Array<string>;
    successes: Array<string>;
};
