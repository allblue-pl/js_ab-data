import { type TS0RawValue } from "@allblue/ts0";
import ABDStringValidator, { type ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
export default class ABDText extends ABDField {
    #private;
    static get TypeSizes(): Record<ABDText_Type, number>;
    get type(): ABDText_Type;
    constructor(type: ABDText_Type, properties?: ABDField_Properties);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean | never;
    __getDBType(dbVersion: DatabaseVersion): string;
    __getDefaultValue(): TS0RawValue;
    __getDBExtra(): string;
    __getFieldValidator(fieldValidatorArgs: ABDStringValidator_Args): ABDStringValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: string): TS0RawValue;
}
export type ABDText_Type = "tiny" | "regular" | "medium";
