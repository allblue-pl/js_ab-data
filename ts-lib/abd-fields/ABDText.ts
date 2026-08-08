import { ts0Assert, type TS0RawValue } from "@allblue/ts0";
import ABDStringValidator, { type ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";
import helper from "../helper.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import ABDField, { type ABDField_Properties } from "./ABDField.ts";

export default class ABDText extends ABDField {
    static get TypeSizes(): Record<ABDText_Type, number> {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    #type: ABDText_Type;


    get type(): ABDText_Type {
        return this.#type;
    }


    constructor(type: ABDText_Type, properties: ABDField_Properties = {}) {
        super(properties);

        this.#type = type;
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean|never {
        if (this.type === 'tiny')
            return dbType === 'tinytext';
        if (this.type === 'regular')
            return dbType === 'text';
        if (this.type === 'medium')
            return dbType === 'mediumtext';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        if (this.type === 'tiny')
            return 'tinytext';
        if (this.type === 'regular')
            return 'text';
        if (this.type === 'medium')
            return 'mediumtext';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDefaultValue(): TS0RawValue {
        return '';
    }

    __getDBExtra(): string {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDStringValidator_Args): 
            ABDStringValidator {
        if (fieldValidatorArgs.maxLength === undefined)
            fieldValidatorArgs.maxLength = ABDText.TypeSizes[this.#type];

        return new ABDStringValidator(fieldValidatorArgs);
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

export type ABDText_Type = "tiny"|"regular"|"medium";