import { ts0Helper, TS0List } from "@allblue/ts0";
import type { TableDef_ColumnInfos } from "./TableDef.ts";
import type TableDef from "./TableDef.ts";
import type ABDField from "./abd-fields/ABDField.ts";
import type ABDFieldRef from "./abd-fields/ABDFieldRef.ts";

export default class TableDefVariant {
    #columns: TS0List<string, ABDField|ABDFieldRef>;
    #columns_Extra: TS0List<string, ABDField|ABDFieldRef>;
    #def: TableDef;
    #name: string;

    get columns(): TS0List<string, ABDField|ABDFieldRef> {
        return this.#columns;
    }

    get columns_Extra(): TS0List<string, ABDField|ABDFieldRef> {
        return this.#columns_Extra;
    }

    get def(): TableDef {
        return this.#def;
    }

    get name(): string {
        return this.#name;
    }


    constructor(name: string, tablDef: TableDef) {
        this.#def = tablDef;   
        this.#columns = new TS0List();
        this.#columns_Extra = new TS0List();
        this.#name = name;
    }

    addColumns(columns: Array<[columnName: string, field: ABDField|ABDFieldRef]>): TableDefVariant {
        for (let column of columns) 
            this.#columns.set(column[0], column[1]);

        return this;
    }

    addColumns_Extra(columns: Array<[columnName: string, field: ABDField|ABDFieldRef]>): TableDefVariant {
        for (let column of columns) 
            this.#columns_Extra.set(column[0], column[1]);

        return this;
    }

    addTableColumns(prefix: string, tableDef: TableDef): TableDefVariant {
        for (let [ columnName, column ] of tableDef.columns)
            this.#columns.set(prefix + columnName, column.field);

        return this;
    }

    addTableColumns_Extra(prefix: string, tableDef: TableDef): TableDefVariant {
        for (let [ columnName, column ] of tableDef.columns)
            this.#columns_Extra.set(prefix + columnName, column.field);

        return this;
    }
}