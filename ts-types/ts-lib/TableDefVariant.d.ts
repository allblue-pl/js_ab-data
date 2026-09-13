import { TS0List } from "@allblue/ts0";
import type TableDef from "./TableDef.ts";
import type ABDField from "./abd-fields/ABDField.ts";
import type ABDColumnRef from "./abd-fields/ABDColumnRef.ts";
export default class TableDefVariant {
    #private;
    get columns(): TS0List<string, ABDField | ABDColumnRef>;
    get columns_Extra(): TS0List<string, ABDField | ABDColumnRef>;
    get def(): TableDef;
    get name(): string;
    constructor(name: string, tablDef: TableDef);
    addColumns(columns: Array<[columnName: string, field: ABDField | ABDColumnRef]>): TableDefVariant;
    addColumns_Extra(columns: Array<[columnName: string, field: ABDField | ABDColumnRef]>): TableDefVariant;
    addTableColumns(prefix: string, tableDef: TableDef, columnNames?: Array<string> | null): TableDefVariant;
    addTableColumns_Extra(prefix: string, tableDef: TableDef, columnNames?: Array<string> | null): TableDefVariant;
}
