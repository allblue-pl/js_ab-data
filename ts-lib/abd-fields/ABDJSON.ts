import ts0, { ts0Assert, type TS0RawObject, type TS0RawValue } from "@allblue/ts0"
    
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";

import helper from "../helper.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";
import type { ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
import ABDText from "./ABDText.ts";
import ABDStringValidator from "../abd-validators/ABDStringValidator.ts";

class ABDJSON extends ABDField {
    static Escape(value: TS0RawValue): string {
        return `'` + ABDJSON.#Parse(value) + `'`;
    }

    static get TypeSizes(): Record<ABDJSON_Type, number> {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    static #Parse(value: TS0RawValue): string {
        let jsonValue = ts0.assertType<ABDJSON_Value>(value,
                presets_ABDJSON_Value).value;

        return helper.escapeString(JSON.stringify({ value: jsonValue, }));
    }


    #type: ABDJSON_Type;


    get type(): ABDJSON_Type {
        return this.#type;
    }


    constructor(size: ABDJSON_Type, properties: ABDField_Properties = {}) {
        super(properties);

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
            fieldValidatorArgs.maxLength = ABDJSON.TypeSizes[this.#type];

        return new ABDStringValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.JSON;
    }

    __getType(): string {
        return 'JSON';
    }

    __escape(value: TS0RawValue): string {
        return ABDJSON.Escape(value);
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return ABDJSON.#Parse(value);
    }

    override __unescape(value: boolean|number|string): boolean|number|string {
        return value;
    }

}
export default ABDJSON;

export type ABDJSON_Type = "tiny"|"regular"|"medium";

export type ABDJSON_Value = {
    value: TS0RawValue,
}
export const presets_ABDJSON_Value = ts0.TRawValue;