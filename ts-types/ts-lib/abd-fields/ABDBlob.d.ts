import { type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import ABDBlobValidator, { type ABDBlobValidator_Args } from "../abd-validators/ABDBlobValidator.ts";
declare class ABDBlob extends ABDField {
    #private;
    static get TypeSizes(): Record<ABDBlob_Type, number>;
    get type(): ABDBlob_Type;
    constructor(type: ABDBlob_Type, properties?: ABDField_Properties);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean | never;
    __getDBExtra(): string;
    __getDBType(dbVersion: DatabaseVersion): string | never;
    __getDefaultValue(): TS0RawValue;
    __getFieldValidator(fieldValidatorArgs: ABDBlobValidator_Args): ABDBlobValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: string): TS0RawValue;
}
export default ABDBlob;
export type ABDBlob_Type = "tiny" | "regular" | "medium";
