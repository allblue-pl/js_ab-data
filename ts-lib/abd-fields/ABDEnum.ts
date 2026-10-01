import { type TS0RawValue } from "@allblue/ts0";
import type DatabaseVersion from "../DatabaseVersion.ts";
import SelectColumnType, { type SelectColumnType_Type } from "../SelectColumnType.ts";
import type { ABDEnumValidator_Args } from "../abd-validators/ABDEnumValidator.ts";
import ABDEnumValidator from "../abd-validators/ABDEnumValidator.ts";
import helper from "../helper.ts";
import ABDField, { type ABDField_Properties_Base } from "./ABDField.ts";

class ABDEnum extends ABDField {
    #values: Array<string>;


    get size(): number {
        let size = 0;
        for (let value of this.values) {
            if (value.length > size)
                size = value.length;
        }
        return size;
    }

    get values(): Array<string> {
        return this.#values;
    }


    constructor(values: Array<string>, properties: ABDField_Properties_Base = {}) {
        super(properties);

        this.#values = values;
    }


    __compareDBType(dbVersion: DatabaseVersion, dbType: string): boolean {
        return dbType === `varchar(${this.size})`;
    }

    __getDBType(dbVersion: DatabaseVersion): string {
        return `varchar(${this.size})`;
    }

    __getDefaultValue(): TS0RawValue {
        return '';
    }

    __getDBExtra(dbVersion: DatabaseVersion): string {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs: ABDEnumValidator_Args): 
            ABDEnumValidator {
        if (fieldValidatorArgs.values === undefined)
            fieldValidatorArgs.values = this.values;

        return new ABDEnumValidator(fieldValidatorArgs);
    }

    __getSelectType(): SelectColumnType_Type {
        return SelectColumnType.String;
    }

    __getType(): string {
        return 'Enum';
    }

    __escape(value: TS0RawValue): string {
        return `'` + this.__parse(value) + `'`;
    }

    __parse(value: TS0RawValue): TS0RawValue {
        return helper.escapeString(String(value));
    }

    override __unescape(value: boolean|number|string): boolean|number|string {
        return value;
    }
}
export default ABDEnum;
