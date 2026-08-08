import { type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import ABDIntValidator, { type ABDIntValidator_Args } from "../abd-validators/ABDIntValidator.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
declare class ABDInt extends ABDField {
    #private;
    get unsigned(): boolean;
    constructor(properties?: ABDInt_Properties, unsigned?: boolean);
    __getDBExtra(dbVersion: DatabaseVersion): string;
    __getDBType(dbVersion: DatabaseVersion): string;
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean;
    __getDefaultValue(): TS0RawValue;
    __getFieldValidator(fieldValidatorArgs: ABDIntValidator_Args): ABDIntValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: TS0RawValue): number;
}
export default ABDInt;
export type ABDInt_Properties = ABDField_Properties & {
    unsigned?: boolean;
};
