import { TS0List, type TS0RawObject, type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args } from "./abd-validators/ABDFieldValidator.ts";
import Validator from "./Validator.ts";
import ABDField from "./abd-fields/ABDField.ts";
import type ABDFieldRef from "./abd-fields/ABDFieldRef.ts";
declare class TableDef {
    #private;
    get alias(): string;
    get autoIncrement(): boolean;
    get columns(): TableDef_ColumnInfos;
    get columns_Extra(): TableDef_ExtraColumnInfos;
    get indexes(): TableDef_IndexInfos;
    get name(): string;
    get pks(): Array<string>;
    constructor(id: number, name: string, alias: string, columns: Array<[string, ABDField, ABDFieldValidator_Args?]>);
    addColumnValidator(columnName: string, fieldValidator: ABDFieldValidator): TableDef;
    addExtras(extraColumns: Array<[string, ABDField]>): TableDef;
    getColumn(columnName: string): TableDef_ColumnInfo;
    getColumn_Field(columnName: string): ABDField | ABDFieldRef;
    getColumnIndex(columnName: string): number;
    getColumnNames(): Array<string>;
    getColumnValidators(columnName: string): Array<ABDFieldValidator>;
    getSelectColumnInfo(columnName: string): [string, ABDField | ABDFieldRef];
    getTableId(): number;
    getTableName(): string;
    getValidatorInfos(): TableDef_ValidatorInfo;
    hasColumn(columnName: string): boolean;
    setIndexes(indexes: {
        [indexName: string]: Array<[string, boolean]>;
    }): TableDef;
    setPKs(primaryKeys: Array<string>): TableDef;
    validateColumn(validator: Validator, validatorFieldName: string, columnName: string, value: TS0RawValue): void;
    validateRow(validator: Validator, row: {
        [columnName: string]: TS0RawValue;
    }, columns?: {
        [columnName: string]: string;
    } | null): void;
    validateRow_Default(validator: Validator, row: {
        [columnName: string]: TS0RawValue;
    }, ignoreColumns?: Array<string>): void;
    validateRow_Default_Columns(validator: Validator, row: {
        [columnName: string]: TS0RawValue;
    }, columnNames?: Array<string>): void;
}
export default TableDef;
export type TableDef_IndexInfos = {
    [indexName: string]: Array<{
        name: string;
        desc: boolean;
    }>;
};
export type TableDef_ColumnInfo = {
    field: ABDField | ABDFieldRef;
    fieldValidator: ABDFieldValidator;
    index: number;
    select: string;
};
export type TableDef_ColumnInfos = TS0List<string, TableDef_ColumnInfo>;
export type TableDef_ExtraColumnInfo = {
    field: ABDField;
};
export type TableDef_ExtraColumnInfos = TS0List<string, TableDef_ExtraColumnInfo>;
export type TableDef_ValidatorInfo = {
    [columnName: string]: {
        field: {
            type: string;
            args: TS0RawObject;
        };
        validators: Array<{
            type: string;
            args: TS0RawObject;
        }>;
    };
};
