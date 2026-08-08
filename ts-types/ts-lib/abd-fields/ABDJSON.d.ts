import { type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import ABDJSONValidator, { type ABDJSONValidator_Args } from "../abd-validators/ABDJSONValidator.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
declare class ABDJSON extends ABDField {
    #private;
    static Escape(value: TS0RawValue): string;
    static get TypeSizes(): Record<ABDJSON_Type, number>;
    get type(): ABDJSON_Type;
    constructor(size: ABDJSON_Type, properties?: ABDField_Properties);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean;
    __getDBType(dbVersion: DatabaseVersion): string;
    __getDefaultValue(): TS0RawValue;
    __getDBExtra(dbVersion: DatabaseVersion): string;
    __getFieldValidator(fieldValidatorArgs: ABDJSONValidator_Args): ABDJSONValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: string): TS0RawValue;
}
export default ABDJSON;
export type ABDJSON_Type = "tiny" | "regular" | "medium";
export type ABDJSON_Value = {
    value: TS0RawValue;
};
export declare const presets_ABDJSON_Value: import("@allblue/ts0").TS0ValueType;
