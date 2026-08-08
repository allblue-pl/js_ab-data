import ts0, { type TS0RawValue } from "@allblue/ts0"
    
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

import ABDStringValidator, { type ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";

import helper from "../helper.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";

class ABDDateTime extends ABDField {
    constructor(properties: ABDField_Properties = {}) {
        super(properties);
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean {
        return dbType === 'datetime';
    }

    __escape(value: TS0RawValue): string {
        return `'` + this.__parse(value) + `'`;
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        return 'datetime'
    }

    __getDefaultValue(): TS0RawValue {
        return '0000-00-00 00:00:00'; // length: 19
    }

    __getDBExtra(): string {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDStringValidator_Args): 
            ABDStringValidator {
        fieldValidatorArgs.maxLength = 19;

        return new ABDStringValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.String;
    }

    __getType(): string {
        return 'String';
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return helper.escapeString(String(value));
    }

    override __unescape(value: string): TS0RawValue {
        return value;
    }
}
export default ABDDateTime;
