import ts0, { ts0Assert, type TS0RawObject, type TS0RawValue } from "@allblue/ts0"
    
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

import ABDDataValidator, { type ABDDataValidator_Args } from "../abd-validators/ABDDataValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";

import helper from "../helper.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";
import type { ABDataDefValueType } from "../abDataDefTypes.ts";

class ABDData extends ABDField {
    static Escape(value: TS0RawValue): string {
        return `'` + ABDData.#Parse(value) + `'`;
    }

    static get TypeSizes(): Record<ABDData_Type, number> {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    static #Parse(value: TS0RawValue): string {
        let DataValue = ts0.assertType<ABDData_Value>(value,
                presets_ABDData_Value).value;

        return helper.escapeString(JSON.stringify({ value: DataValue, }));
    }


    #dataDef: ABDataDefValueType;
    #type: ABDData_Type;


    get dataDef(): ABDataDefValueType {
        return this.#dataDef;
    }

    get type(): ABDData_Type {
        return this.#type;
    }


    constructor(dataDef: ABDataDefValueType, size: ABDData_Type, properties: ABDField_Properties = {}) {
        super(properties);

        this.#dataDef = dataDef;
        this.#type = size;
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean {
        if (this.type === 'tiny')
            return dbType === 'tinytext';
        if (this.type === 'regular')
            return dbType === 'text';
        if (this.type === 'medium')
            return dbType === 'mediumtext';

        ts0Assert(false, `Unknown 'size' field type.`);
    }

    __getDBType(dbVersion: DatabaseVersion): string {
         if (this.type === 'tiny')
            return 'tinytext';
        if (this.type === 'regular')
            return 'text';
        if (this.type === 'medium')
            return 'mediumtext';

        ts0Assert(false, `Unknown 'size' field type.`);
    }

    __getDefaultValue(): TS0RawValue {
        return null;
    }

    __getDBExtra(dbVersion: DatabaseVersion): string {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDDataValidator_Args): 
            ABDDataValidator {
        if (fieldValidatorArgs.type === undefined)
            fieldValidatorArgs.type = this.#type;

        return new ABDDataValidator(fieldValidatorArgs as ABDDataValidator_Args);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.JSON;
    }

    __getType(): string {
        return 'Data';
    }

    __escape(value: TS0RawValue): string {
        return ABDData.Escape(value);
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return ABDData.#Parse(value);
    }

    override __unescape(value: boolean|number|string): boolean|number|string {
        return value;
    }

}
export default ABDData;

export type ABDData_Type = "tiny"|"regular"|"medium";

export type ABDData_Value = {
    value: TS0RawValue,
}
export const presets_ABDData_Value = ts0.TRawValue;