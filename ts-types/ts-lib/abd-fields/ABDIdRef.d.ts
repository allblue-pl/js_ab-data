import { type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";
declare class ABDIdRef extends ABDField {
    constructor(properties?: ABDField_Properties);
    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean;
    __getDBExtra(): string;
    __getDBType(dbVersion: DatabaseVersion): string;
    __getDefaultValue(): TS0RawValue;
    __getFieldValidator(fieldValidatorArgs: ABDFieldValidator_Args): ABDFieldValidator;
    __getSelectType(): SelectColumnType_Type;
    __getType(): string;
    __escape(value: TS0RawValue): string;
    __parse(value: TS0RawValue): TS0RawValue;
    __unescape(value: boolean | number | string): boolean | number | string;
}
export default ABDIdRef;
