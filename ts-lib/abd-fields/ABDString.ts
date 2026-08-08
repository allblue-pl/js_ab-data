import ts0, { type TS0RawValue } from "@allblue/ts0"
    
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

import ABDStringValidator, { type ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";

import helper from "../helper.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";

class ABDString extends ABDField {
    #size: number;


    get size(): number {
        return this.#size;
    }


    constructor(size: number, properties: ABDField_Properties = {}) {
        super(properties);

        this.#size = size;
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean {
        return dbType === `varchar(${this.size})`;
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        return `varchar(${this.size})`;
    }

    __getDefaultValue(): TS0RawValue {
        return '';
    }

    __getDBExtra(dbVersion: DatabaseVersion): string {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDStringValidator_Args): 
            ABDStringValidator {
        if (fieldValidatorArgs.maxLength === undefined)
            fieldValidatorArgs.maxLength = this.size;

        return new ABDStringValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.String;
    }

    __getType(): string {
        return 'String';
    }

    __escape(value: TS0RawValue): string {
        return `'` + this.__parse(value) + `'`;
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return helper.escapeString(String(value));
    }

    override __unescape(value: string): TS0RawValue {
        return value;
    }
}
export default ABDString;
