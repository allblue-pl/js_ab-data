import { type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import ABDStringValidator, { type ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
declare class ABDString extends ABDField {
    #private;
    get size(): number;
    constructor(size: number, properties?: ABDField_Properties);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean;
    __getDBType(dbVersion: DatabaseVersion): string;
    __getDefaultValue(): TS0RawValue;
    __getDBExtra(dbVersion: DatabaseVersion): string;
    __getFieldValidator(fieldValidatorArgs: ABDStringValidator_Args): ABDStringValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: string): TS0RawValue;
}
export default ABDString;
