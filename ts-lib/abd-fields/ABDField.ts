import ts0, { ts0Helper, ts0Virtual, type TS0NotSet, type TS0RawValue } from "@allblue/ts0"
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import DatabaseVersion, { type DatabaseType } from "../DatabaseVersion.ts";
import ABDFieldValidator, { type ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";

abstract class ABDField {
    #notNull: boolean;
    #defaultValue: TS0RawValue|undefined;

    get defaultValue(): TS0RawValue {
        return this.#defaultValue === undefined ? 
                (this.notNull ? this.__getDefaultValue() : null) :
                this.#defaultValue;
    }

    get notNull(): boolean {
        return this.#notNull;
    }


    constructor(properties: ABDField_Properties = {}) {
        this.#notNull = properties.notNull === undefined ? 
                false : properties.notNull;
        this.#defaultValue = properties.defaultValue;
    }

    compareDBType(dbVersion: DatabaseVersion, dbType: string, 
            dbExtra: string): boolean {
        return this.__compareDBType(dbVersion, dbType, dbExtra);
    }

    getDBType(dbVersion: DatabaseVersion): string {
        return this.__getDBType(dbVersion);
    }

    getDBExtra(dbVersion: DatabaseVersion): string {
        return this.__getDBExtra(dbVersion);
    }

    getSelectType(): SelectColumnType_Type {
        return this.__getSelectType();
    }

    getType(): string {
        return this.__getType();
    }

    getQuery_Column(dbVersion: DatabaseVersion, columnName: string): string {
        let dbExtra = this.getDBExtra(dbVersion);
        return `\`${columnName}\` ` + this.getDBType(dbVersion) + (this.notNull ? 
                ' NOT NULL' : ' NULL') + (dbExtra === '' ? '' : ` ${dbExtra}`);
    }

    escape(value: TS0RawValue): string {
        if (value === null)
            return 'NULL';

        return ts0.rtn('string', this.__escape(value));
    }

    escapeArray(arr: Array<TS0RawValue>): string {
        let arr_Escaped = [];
        for (let val of arr)
            arr_Escaped.push(this.escape(val));

        return '(' + arr_Escaped.join(',') + ')';
    }

    getFieldValidator(fieldValidatorArgs: ABDFieldValidator_Args): ABDFieldValidator {
        if (!('notNull' in fieldValidatorArgs))
            fieldValidatorArgs.notNull = this.notNull;

        return this.__getFieldValidator(fieldValidatorArgs);
    }

    parse(value: TS0RawValue): TS0RawValue {
        if (value === null)
            return null;

        return this.__parse(value);
    }

    unescape(value: string): TS0RawValue {
        if (value === null)
            return null;

        return this.__unescape(value);
    }


    __unescape(value: string): TS0RawValue { 
        return value;
    }


    abstract __compareDBType(dbVersion: DatabaseVersion, dbType: string, 
            dbExtra: string): boolean;
    abstract __getDBExtra(dbVersion: DatabaseVersion): string;
    abstract __getDBType(dbVersion: DatabaseVersion): string;
    abstract __getDefaultValue(): TS0RawValue;
    abstract __getFieldValidator(fieldValidatorArgs: ABDFieldValidator_Args): ABDFieldValidator;
    abstract __getSelectType(): SelectColumnType_Type;
    abstract __getType(): string;
    abstract __escape(value: TS0RawValue): string;
    abstract __parse(value: TS0RawValue): TS0RawValue;
}
export default ABDField;

export type ABDField_Properties = {
    notNull?: boolean,
    defaultValue?: TS0RawValue,
} & {[argName: string]: TS0RawValue};