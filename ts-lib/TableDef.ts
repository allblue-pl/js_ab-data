import ts0, { ts0Assert, TS0AssertError, TS0List, type TS0RawObject, type TS0RawValue } from "@allblue/ts0"
import f from "./abd-fields/index.ts";
import ABDFieldValidator, { type ABDFieldValidator_Args } from "./abd-validators/ABDFieldValidator.ts";
import Validator from "./Validator.ts";
import type FieldInfo from "./FieldInfo.ts";
import type ABDField from "./abd-fields/ABDField.ts";
import type TableInfo from "./TableInfo.ts";
import type IndexInfo from "./IndexInfo.ts";

class TableDef {
    #alias: string;
    #autoIncrementColumn: string|null;
    #columns: TablDef_ColumnInfos;
    #columnValidators: TablDef_ColumnValidators;
    #id: number;
    #indexes: TableDef_IndexInfos;
    #name: string;
    #primaryKeys: Array<string>|null;


    get alias(): string {
        return this.#alias;
    }

    get autoIncrement(): boolean {
        return this.#autoIncrementColumn !== null;
    }

    get columns(): TablDef_ColumnInfos {
        return this.#columns;
    }

    get indexes(): TableDef_IndexInfos {
        return this.#indexes;
    }

    get name(): string {
        return this.#name;
    }

    get pks(): Array<string> {
        if (this.#autoIncrementColumn !== null)
            return [ this.#autoIncrementColumn ];

        ts0Assert(this.#primaryKeys !== null, "Table with 'ABDAutoIncremenet'`" +
                " column does not haves primary keys.");

        return this.#primaryKeys;
    }

    constructor(id: number, name: string, alias: string, columns: 
            Array<[ string, ABDField, ABDFieldValidator_Args? ]>) {
        this.#id = id;
        this.#name = name;
        this.#alias = alias;
        this.#primaryKeys = null;
        this.#autoIncrementColumn = null;
        this.#columnValidators = {};
        this.#indexes = {};

        this.#columns = new TS0List();
        for (let column of columns) {
            let name = column[0];
            let field = column[1];
            let fieldValidatorArgs = column[2];
            if (fieldValidatorArgs === undefined)
                fieldValidatorArgs = {};

            this.#columns.set(name, {
                field: field,
                fieldValidator: field.getFieldValidator(fieldValidatorArgs),
                index: this.#columns.size,
                select: name,
            });

            if (field instanceof f.ABDAutoIncrementId) {
                this.#autoIncrementColumn = name;
                this.#primaryKeys = null;
            }
        }
    }

    addColumnValidator(columnName: string, fieldValidator: ABDFieldValidator): 
            TableDef {
        if (!this.hasColumn(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        if (!(columnName in this.#columnValidators))
            this.#columnValidators[columnName] = [];

        this.#columnValidators[columnName].push(fieldValidator);

        return this;
    }

    getColumn(columnName: string): TablDef_ColumnInfo {
        if (!this.#columns.has(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        return this.#columns.get(columnName);
    }

    getColumn_Field(columnName: string): ABDField {
        return this.getColumn(columnName).field;
    }

    getColumnIndex(columnName: string): number {
        return this.getColumn(columnName).index;
    }

    getColumnNames(): Array<string> {
        return this.#columns.getKeys();
    }

    getColumnValidators(columnName: string): Array<ABDFieldValidator> {
        let column = this.getColumn(columnName);
        let validators = [ column.fieldValidator ];
        if (!(columnName in this.#columnValidators))
            return validators;

        for (let columnValidator of this.#columnValidators[columnName])
            validators.push(columnValidator);

        return validators;
    }

    getSelectColumnInfo(columnName: string): [ string, ABDField ] {
        let column = this.getColumn(columnName);

        return [ column.select, column.field ];
    }

    getTableId(): number {
        return this.#id;
    }

    getTableName(): string {
        return this.#name;
    }

    getValidatorInfos(): TableDef_ValidatorInfo {
        let validatorInfo: TableDef_ValidatorInfo = {};
        for (let [ columnName, column ] of this.#columns) {
            validatorInfo[columnName] = {
                field: {
                    type: column.fieldValidator.getType(),
                    args: column.fieldValidator.args,
                },
                validators: [],
            };

            if (columnName in this.#columnValidators) {
                for (let columnValidator of this.#columnValidators[columnName]) {
                    validatorInfo[columnName].validators.push({
                        type: columnValidator.getType(),
                        args: columnValidator.args,
                    });
                }
            }
        }

        return validatorInfo;
    }
    
    hasColumn(columnName: string): boolean {
        return this.#columns.has(columnName);
    }

    setIndexes(indexes: {[indexName: string]: Array<[ string, boolean ]>}): TableDef {
        for (let indexName in indexes) {
            for (let indexColumn of indexes[indexName]) {
                let columnName = indexColumn[0];
                if (!this.hasColumn(columnName))
                        throw new Error(`Index column '${columnName}' does not exist.`);
            }
        }
        
        this.#indexes = {};
        for (let indexName in indexes) {
            this.#indexes[this.name + '-' + indexName] = [];
            for (let indexColumn of indexes[indexName]) {
                this.#indexes[this.name + '-' + indexName].push({
                    name: indexColumn[0], 
                    desc: indexColumn[1],
                });
            }
        }

        return this;
    }

    setPKs(primaryKeys: Array<string>): TableDef {
        if (this.#autoIncrementColumn !== null)
            throw new Error(`Cannot set PKs for the table with 'ABDAutoIncrement' column.`);

        for (let columnName of primaryKeys) {
            if (!this.hasColumn(columnName))
                throw new Error(`Cannot set PKs. Column '${columnName}' does not exist.`);
            if (!this.#columns.get(columnName).field.notNull)
                throw new Error(`Primary Key '${columnName}' must be 'notNull'.`);
        }

        this.#autoIncrementColumn = null;
        this.#primaryKeys = primaryKeys;

        return this;
    }

    validateColumn(validator: Validator, validatorFieldName: string, 
            columnName: string, value: TS0RawValue): void {
        validator.addField(validatorFieldName, value);

        let column = this.getColumn(columnName);
        // let column_ValidatorField = column.field.getFieldValidator(
        //         column.fieldValidatorInfo);

        validator.addFieldValidator(validatorFieldName, column.fieldValidator);
        if (columnName in this.#columnValidators) {
            for (let fieldValidator of this.#columnValidators[columnName])
                validator.addFieldValidator(validatorFieldName, fieldValidator);
        }
    }

    validateRow(validator: Validator, row: {[columnName: string]: TS0RawValue}, 
            columns: {[columnName: string]: string}|null = null): void {
        if (columns === null) {
            columns = {};
            for (let [ columnName, column ] of this.columns)
                columns[columnName] = columnName;
        }

        for (let columnName in columns) {
            if (!(columnName in row))
                throw new Error(`Column '${columnName}' not set in row.`);
            if (typeof row[columnName] === 'undefined')
                throw new Error(`Column '${columnName}' is 'undefined' in row.`);

            this.validateColumn(validator, columns[columnName], columnName,
                    row[columnName]);
        }
    }

    validateRow_Default(validator: Validator, row: {[columnName: string]: TS0RawValue}, 
            ignoreColumns: Array<string> = []): void {
        let columns: {[columnName: string]: string} = {};
        for (let [ columnName, column ] of this.columns) {
            if (columnName === '_Modified_DateTime')
                continue;

            if (!ignoreColumns.includes(columnName))
                columns[columnName] = columnName;
        }

        this.validateRow(validator, row, columns);
    }

    validateRow_Default_Columns(validator: Validator, row: {[columnName: string]: TS0RawValue}, 
            columnNames: Array<string> = []): void {
        let columns: {[columnName: string]: string} = {};
        for (let columnName of columnNames) {
            if (!this.hasColumn(columnName))
                throw new Error(`Column '${columnName}' does not exist.`);

            columns[columnName] = columnName;
        }

        this.validateRow(validator, row, columns);
    }
}
export default TableDef;


export type TableDef_IndexInfos = {[indexName: string]: Array<{
    name: string,
    desc: boolean,
}>};

type TablDef_ColumnInfo = {
    field: ABDField,
    fieldValidator: ABDFieldValidator,
    index: number,
    select: string,
};
type TablDef_ColumnInfos = TS0List<string, TablDef_ColumnInfo>;

type TablDef_ColumnValidators = {[columnName: string]: Array<ABDFieldValidator>};

export type TableDef_ValidatorInfo = {[columnName: string]: {
    field: {
        type: string,
        args: TS0RawObject,
    },
    validators: Array<{
        type: string,
        args: TS0RawObject,
    }>,
}};