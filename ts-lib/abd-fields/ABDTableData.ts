import ts0, { ts0Assert, type TS0RawValue } from "@allblue/ts0";
    
import ABDField, { type ABDField_Properties_Base } from "./ABDField.ts";

import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";

import helper from "../helper.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDataDefValueType } from "../abDataDefTypes.ts";
import ABDStringValidator from "../abd-validators/ABDStringValidator.ts";
import type { ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";

class ABDTableData extends ABDField {
    static Escape(value: TS0RawValue): string {
        return `'` + ABDTableData.#Parse(value) + `'`;
    }

    static get TypeSizes(): Record<ABDTableData_Type, number> {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    static #Parse(value: TS0RawValue): string {
        let DataValue = ts0.assertType<ABDTableData_Value>(value,
                presets_ABDTableData_Value).value;

        return helper.escapeString(JSON.stringify({ value: DataValue, }));
    }


    #dataDef: ABDataDefValueType;
    #type: ABDTableData_Type;


    get dataDef(): ABDataDefValueType {
        return this.#dataDef;
    }

    get type(): ABDTableData_Type {
        return this.#type;
    }


    constructor(dataDef: ABDataDefValueType, size: ABDTableData_Type, properties: ABDField_Properties_Base = {}) {
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

    __getFieldValidator(fieldValidatorArgs: ABDStringValidator_Args): 
            ABDStringValidator {
        if (fieldValidatorArgs.maxLength === undefined)
            fieldValidatorArgs.maxLength = ABDTableData.TypeSizes[this.#type];

        return new ABDStringValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.JSON;
    }

    __getType(): string {
        return 'Data';
    }

    __escape(value: TS0RawValue): string {
        return ABDTableData.Escape(value);
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return ABDTableData.#Parse(value);
    }

    override __unescape(value: boolean|number|string): boolean|number|string {
        return value;
    }

}
export default ABDTableData;

export type ABDTableData_Type = "tiny"|"regular"|"medium";

export type ABDTableData_Value = {
    value: TS0RawValue,
}
export const presets_ABDTableData_Value = ts0.TRawValue;