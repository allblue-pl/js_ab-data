import { type TS0RawValue } from "@allblue/ts0"
import ABDField from "./ABDField.ts";
import ABDLongValidator from "../abd-validators/ABDLongValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";

class ABDId extends ABDField {
    constructor() {
        super({ notNull: true });
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): 
            boolean {
        return [ 'bigint', 'bigint(20)' ].includes(dbType);
    }

    __getDBExtra(): string {
        return '';
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        return 'bigint';
    }

    __getDefaultValue(): TS0RawValue {
        return 0;
    }

    __getFieldValidator(fieldValidatorArgs: ABDFieldValidator_Args): ABDFieldValidator {
        return new ABDLongValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.Long;
    }

    __getType(): string {
        return 'Id';
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
export default ABDId;
