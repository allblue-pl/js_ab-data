import { type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import ABDFloatValidator, { type ABDFloatValidator_Args } from "../abd-validators/ABDFloatValidator.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
declare class ABDFloat extends ABDField {
    constructor(properties: ABDField_Properties);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean;
    __getDefaultValue(): TS0RawValue;
    __getDBExtra(dbVersion: DatabaseVersion): string;
    __getDBType(dbVersion: DatabaseVersion): string;
    __getFieldValidator(fieldValidatorArgs: ABDFloatValidator_Args): ABDFloatValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: string): TS0RawValue;
}
export default ABDFloat;
