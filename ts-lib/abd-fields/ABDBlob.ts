import { ts0Assert, type TS0RawValue } from "@allblue/ts0";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import helper from "../helper.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import ABDBlobValidator, { type ABDBlobValidator_Args } from "../abd-validators/ABDBlobValidator.ts";

class ABDBlob extends ABDField {
    static get TypeSizes(): Record<ABDBlob_Type, number> {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    #type: ABDBlob_Type;


    get type(): ABDBlob_Type {
        return this.#type;
    }   

    constructor(type: ABDBlob_Type, properties: ABDField_Properties = {}) {
        super(properties);

        this.#type = type;
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean|never {
        if (this.type === 'tiny')
            return dbType === 'tinyblob';
        if (this.type === 'regular')
            return dbType === 'blob';
        if (this.type === 'medium')
            return dbType === 'mediumblob';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDBExtra(): string {
        return '';
    }

    __getDBType(dbVersion: DatabaseVersion): string|never {
        if (this.type === 'tiny')
            return 'tinyblob';
        if (this.type === 'regular')
            return 'blob';
        if (this.type === 'medium')
            return 'mediumblob';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDefaultValue(): TS0RawValue {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDBlobValidator_Args): 
            ABDBlobValidator {
        if (fieldValidatorArgs.maxLength === undefined)
            fieldValidatorArgs.maxLength = ABDBlob.TypeSizes[this.#type];

        return new ABDBlobValidator(fieldValidatorArgs as ABDBlobValidator_Args);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.String;
    }

    __getType(): string {
        return 'Text';
    }

    __escape(value: TS0RawValue): string {
        return `'` + this.__parse(value) + `'`;
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return helper.escapeString(String(value));
    }

    override __unescape(value: string): TS0RawValue {
        return value;
    }

}
export default ABDBlob;

export type ABDBlob_Type = "tiny"|"regular"|"medium";