import ts0, { type TS0RawValue } from "@allblue/ts0"
    
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

import ABDFloatValidator, { type ABDFloatValidator_Args } from "../abd-validators/ABDFloatValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";

class ABDFloat extends ABDField {

    constructor(properties: ABDField_Properties) {
        super(properties);
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean {
        return dbType === 'float';
    }

    __getDefaultValue(): TS0RawValue {
        return 0.0;
    }

    __getDBExtra(dbVersion: DatabaseVersion): string {
        return '';
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        return 'float';
    }

    __getFieldValidator(fieldValidatorArgs: ABDFloatValidator_Args): 
            ABDFloatValidator {
        return new ABDFloatValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.Float;
    }

    __getType(): string {
        return 'Float';
    }

    __escape(value: TS0RawValue): string {
        return String(this.__parse(value));
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return value;
    }

    override __unescape(value: string): TS0RawValue {
        return parseFloat(value);
    }

}
export default ABDFloat;