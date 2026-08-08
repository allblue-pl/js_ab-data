import ts0, { type TS0RawValue } from "@allblue/ts0"
    
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

import ABDTimeValidator, { type ABDTimeValidator_Args } from "../abd-validators/ABDTimeValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";

class ABDTime extends ABDField {
    constructor(properties: ABDField_Properties = {}) {
        super(properties);
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean {
        return [ 'bigint', 'bigint(20)' ].includes(dbType);
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        return 'bigint';
    }

    __getDefaultValue(): TS0RawValue {
        return 0;
    }

    __getDBExtra(): string {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDTimeValidator_Args): 
            ABDTimeValidator {
        return new ABDTimeValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.Long;
    }

    __getType(): string {
        return 'Time';
    }

    __escape(value: TS0RawValue): string {
        return String(this.__parse(value));
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return value;
    }

    override __unescape(value: string): TS0RawValue {
        return Number(value);
    }

}
export default ABDTime;
