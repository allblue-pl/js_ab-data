import ts0, { type TS0RawValue } from "@allblue/ts0"
    
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

import ABDBoolValidator, { type ABDBoolValidator_Args } from "../abd-validators/ABDBoolValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";


class ABDBool extends ABDField {
    constructor(properties: ABDField_Properties = {}) {
        super(properties);
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean {
        return dbType === 'tinyint(1)' || dbType === 'bool';
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        return 'tinyint(1)';
    }

    __getDefaultValue(): TS0RawValue {
        return false;
    }

     __getDBExtra(dbVersion: DatabaseVersion): string {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDBoolValidator_Args): 
            ABDBoolValidator {
        return new ABDBoolValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.Bool;
    }

    __getType(): string {
        return 'Bool';
    }

    __escape(value: TS0RawValue): string {
        if (this.__parse(value))
            return '1';

        return '0';
    }

    __parse(value: TS0RawValue): TS0RawValue {
        if (value)
            return true;

        return false;
    }

    override __unescape(value: string): TS0RawValue {
        return value ? true : false;
    }

}
export default ABDBool;
