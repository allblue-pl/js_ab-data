import ts0, { type TS0RawValue } from "@allblue/ts0"
import ABDFieldValidator from "./abd-validators/ABDFieldValidator.ts";
import type ABDField from "./abd-fields/ABDField.ts";
import type FieldInfo from "./FieldInfo.ts";

export default class Validator {
    #info: ValidatorInfo;

    constructor() {
        this.#info =  {
            valid: true,
            fields: {},
            state: '',
            errors: [],
        };
    }

    addField(fieldName: string, fieldValue: TS0RawValue): void {
        this.#fields_Add(fieldName, fieldValue);
    }

    addFieldValidator(fieldName: string, fieldValidator: ABDFieldValidator): void {
        if (!this.hasField(fieldName))
            throw new Error(`Field '${fieldName}' does not exist.`);

        fieldValidator.validate(this, fieldName, this.#info.fields[fieldName].value);
    }

    getFieldInfo(fieldName: string): ValidatorFieldInfo {
        if (!(fieldName in this.#info['fields']))
            throw new Error(`Field '${fieldName}' does not exist.`);

        return this.#info.fields[fieldName];
    }

    getInfo(): ValidatorInfo {
        return this.#info;
    }

    error(message: string): void {
        this.#info.valid = false;
        this.#info.errors.push(message);
    }

    fieldError(fieldName: string, message: string): void {
        let field = this.#fields_Get(fieldName);

        this.#info.valid = false;
        this.#info.state = 'error';

        field.valid = false;
        field.errors.push(message);
    }

    hasField(fieldName: string): boolean {
        return fieldName in this.#info['fields'];
    }

    isFieldValid(fieldName: string): boolean {
        return this.getFieldInfo(fieldName).valid;
    }

    isValid(): boolean {
        return this.#info.valid;
    }


    #fields_Add(fieldName: string, fieldValue: TS0RawValue): ValidatorFieldInfo {
        this.#info.fields[fieldName] = {
            valid: true,
            value: fieldValue,
            state: '',
            errors: [],
            warnings: [],
            successes: [],
        };

        return this.#info.fields[fieldName];
    }

    #fields_Get(fieldName: string): ValidatorFieldInfo {
        if (!this.hasField(fieldName))
            throw new Error(`Field '${fieldName}' does not exist.`);

        return this.#info.fields[fieldName];
    }

    // _fields_Exists(fieldName)
    // {
    //     return fieldName in this.#info['fields'];
    // }
}

export type ValidatorInfo = {
    valid: boolean,
    fields: {[fieldName: string]: ValidatorFieldInfo},
    state: string,
    errors: Array<string>,
};

export type ValidatorFieldInfo = {
    valid: boolean,
    value: TS0RawValue,
    state: '',
    errors: Array<string>,
    warnings: Array<string>,
    successes: Array<string>,
}