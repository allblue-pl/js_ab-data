import { type TS0RawValue } from "@allblue/ts0";
import type DatabaseVersion from "../DatabaseVersion.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type { ABDEnumValidator_Args } from "../abd-validators/ABDEnumValidator.ts";
import ABDEnumValidator from "../abd-validators/ABDEnumValidator.ts";
import ABDField, { type ABDField_Properties_Base } from "./ABDField.ts";
declare class ABDEnum extends ABDField {
    #private;
    get size(): number;
    get values(): Array<string>;
    constructor(values: Array<string>, properties?: ABDField_Properties_Base);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean;
    __getDBType(dbVersion: DatabaseVersion): string;
    __getDefaultValue(): TS0RawValue;
    __getDBExtra(dbVersion: DatabaseVersion): string;
    __getFieldValidator(fieldValidatorArgs: ABDEnumValidator_Args): ABDEnumValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: boolean | number | string): boolean | number | string;
}
export default ABDEnum;
