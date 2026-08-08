import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDField from "./ABDField.ts";

import ABDIntValidator from "../abd-validators/ABDIntValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";

class ABDAutoIncrementId extends ABDField {
    constructor() {
        super({ notNull: true, });
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string, 
            dbExtra: string): boolean {
         if (dbVersion.type === 'sqlite')
            return dbType === 'integer';

        if (dbExtra !== 'auto_increment')
            return false;

        return dbType === 'int';        
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        if (dbVersion.type === 'sqlite')
            return 'integer';

        return 'int';
    }

    __getDefaultValue(): TS0RawValue {
        return 0;
    }

    __getDBExtra(dbVersion: DatabaseVersion): string {
        if (dbVersion.type === 'sqlite')
            return '';

        return 'auto_increment';
    }

    __getFieldValidator(fieldValidatorArgs: ABDFieldValidator_Args): 
            ABDFieldValidator {
        return new ABDIntValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.Int;
    }

    __getType(): string {
        return 'AutoIncrementId';
    }

    __escape(value: TS0RawValue): string {
        return String(Math.round(Number(value)));
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return Math.round(Number(value));
    }

    override __unescape(value: string): TS0RawValue {
        return parseInt(value);
    }
}
export default ABDAutoIncrementId;
