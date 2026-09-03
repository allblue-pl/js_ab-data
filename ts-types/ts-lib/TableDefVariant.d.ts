import { TS0List } from "@allblue/ts0";
import type TableDef from "./TableDef.ts";
import type ABDField from "./abd-fields/ABDField.ts";
import type ABDFieldRef from "./abd-fields/ABDFieldRef.ts";
export default class TableDefVariant {
    #private;
    get columns(): TS0List<string, ABDField | ABDFieldRef>;
    get columns_Extra(): TS0List<string, ABDField | ABDFieldRef>;
    get def(): TableDef;
    get name(): string;
    constructor(name: string, tablDef: TableDef);
    addColumns(columns: Array<[columnName: string, field: ABDField | ABDFieldRef]>): TableDefVariant;
    addColumns_Extra(columns: Array<[columnName: string, field: ABDField | ABDFieldRef]>): TableDefVariant;
    addTableColumns(prefix: string, tableDef: TableDef): TableDefVariant;
    addTableColumns_Extra(prefix: string, tableDef: TableDef): TableDefVariant;
}
