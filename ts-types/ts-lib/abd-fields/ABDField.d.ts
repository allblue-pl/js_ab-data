import { type TS0RawValue } from "@allblue/ts0";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import DatabaseVersion from "../DatabaseVersion.ts";
import ABDFieldValidator, { type ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
declare abstract class ABDField {
    #private;
    get defaultValue(): TS0RawValue;
    get notNull(): boolean;
    constructor(properties?: ABDField_Properties);
    compareDBType(dbVersion: DatabaseVersion, dbType: string, dbExtra: string): boolean;
    getDBType(dbVersion: DatabaseVersion): string;
    getDBExtra(dbVersion: DatabaseVersion): string;
    getSelectType(): SelectColumnType_Type;
    getType(): string;
    getQuery_Column(dbVersion: DatabaseVersion, columnName: string): string;
    escape(value: TS0RawValue): string;
    escapeArray(arr: Array<TS0RawValue>): string;
    getFieldValidator(fieldValidatorArgs: ABDFieldValidator_Args): ABDFieldValidator;
    parse(value: TS0RawValue): TS0RawValue;
    unescape(value: string): TS0RawValue;
    __unescape(value: string): TS0RawValue;
    abstract __compareDBType(dbVersion: DatabaseVersion, dbType: string, dbExtra: string): boolean;
    abstract __getDBExtra(dbVersion: DatabaseVersion): string;
    abstract __getDBType(dbVersion: DatabaseVersion): string;
    abstract __getDefaultValue(): TS0RawValue;
    abstract __getFieldValidator(fieldValidatorArgs: ABDFieldValidator_Args): ABDFieldValidator;
    abstract __getSelectType(): SelectColumnType_Type;
    abstract __getType(): string;
    abstract __escape(value: TS0RawValue): string;
    abstract __parse(value: TS0RawValue): TS0RawValue;
}
export default ABDField;
export type ABDField_Properties = {
    notNull?: boolean;
    defaultValue?: TS0RawValue;
} & {
    [argName: string]: TS0RawValue;
};
