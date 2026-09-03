import { type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDataDefValueType } from "../abDataDefTypes.ts";
import ABDStringValidator from "../abd-validators/ABDStringValidator.ts";
import type { ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
declare class ABDData extends ABDField {
    #private;
    static Escape(value: TS0RawValue): string;
    static get TypeSizes(): Record<ABDData_Type, number>;
    get dataDef(): ABDataDefValueType;
    get type(): ABDData_Type;
    constructor(dataDef: ABDataDefValueType, size: ABDData_Type, properties?: ABDField_Properties);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean;
    __getDBType(dbVersion: DatabaseVersion): string;
    __getDefaultValue(): TS0RawValue;
    __getDBExtra(dbVersion: DatabaseVersion): string;
    __getFieldValidator(fieldValidatorArgs: ABDStringValidator_Args): ABDStringValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: boolean | number | string): boolean | number | string;
}
export default ABDData;
export type ABDData_Type = "tiny" | "regular" | "medium";
export type ABDData_Value = {
    value: TS0RawValue;
};
export declare const presets_ABDData_Value: import("@allblue/ts0").TS0ValueType;
