import ts0, { ts0Helper, type TS0RawValue } from "@allblue/ts0"

import ABDField, { type ABDField_Properties, } from "./ABDField.ts";

import ABDIntValidator, { type ABDIntValidator_Args } from "../abd-validators/ABDIntValidator.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type DatabaseVersion from "../DatabaseVersion.ts";

class ABDInt extends ABDField {
    #unsigned: boolean;

    get unsigned(): boolean {
        return this.#unsigned;
    }

    constructor(properties: ABDInt_Properties = {}, unsigned: boolean = false) {
        super(properties);

        this.#unsigned = properties.unsigned === undefined ?
                false : properties.unsigned;
    }


    __getDBExtra(dbVersion: DatabaseVersion): string {
        return '';
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        if (dbVersion.type === 'mysql')
            return 'int' + (this.unsigned ? ' unsigned' : '');

        return 'int';
    }

    __compareDBType(dbVersion: DatabaseVersion, dbType: string): 
            boolean {
        let unsigned = this.unsigned ? ' unsigned' : '';
        return [ `int${unsigned}`, `int(11)${unsigned}` ].includes(dbType);
    }

    __getDefaultValue(): TS0RawValue {
        return 0;
    }

    __getFieldValidator(fieldValidatorArgs: ABDIntValidator_Args): 
            ABDIntValidator {
        return new ABDIntValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.Int;
    }

    __getType(): string {
        return 'Int';
    }

    __escape(value: TS0RawValue): string {
        return String(this.__parse(value));
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return Math.floor(Number(value));
    }

    override __unescape(value: TS0RawValue): number {
        return parseInt(String(value));
    }

}
export default ABDInt;

export type ABDInt_Properties = ABDField_Properties & {
    unsigned?: boolean
};