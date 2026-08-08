import { TS0List, type TS0RawObject, type TS0RawValue } from "@allblue/ts0";
import ABDFieldValidator, { type ABDFieldValidator_Args } from "./abd-validators/ABDFieldValidator.ts";
import Validator from "./Validator.ts";
import type ABDField from "./abd-fields/ABDField.ts";
declare class TableDef {
    #private;
    get alias(): string;
    get autoIncrement(): boolean;
    get columns(): TablDef_ColumnInfos;
    get indexes(): TableDef_IndexInfos;
    get name(): string;
    get pks(): Array<string>;
    constructor(id: number, name: string, alias: string, columns: Array<[string, ABDField, ABDFieldValidator_Args?]>);
    addColumnValidator(columnName: string, fieldValidator: ABDFieldValidator): TableDef;
    getColumn(columnName: string): TablDef_ColumnInfo;
    getColumn_Field(columnName: string): ABDField;
    getColumnIndex(columnName: string): number;
    getColumnNames(): Array<string>;
    getColumnValidators(columnName: string): Array<ABDFieldValidator>;
    getSelectColumnInfo(columnName: string): [string, ABDField];
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
type TablDef_ColumnInfo = {
    field: ABDField;
    fieldValidator: ABDFieldValidator;
    index: number;
    select: string;
};
type TablDef_ColumnInfos = TS0List<string, TablDef_ColumnInfo>;
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
