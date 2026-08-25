import RequestDef from "./RequestDef.ts";
import { type ABDataDefPreset } from "./abDataDefTypes.ts";
import { type TS0RawValue } from "@allblue/ts0";
declare class TableRequestDef extends RequestDef {
    static Args_Delete(): ABDataDefPreset;
    static Args_Select(): ABDataDefPreset;
    static Assert_Args_Join(args: TableRequest_Args_Join): TableRequest_Args_Join_Parsed;
    static Assert_Args_Select(args: TableRequest_Args_Select): TableRequest_Args_Select_Parsed;
    constructor(readOnly?: boolean);
}
export default TableRequestDef;
export type TableRequest_Args_Delete = {
    where: WhereConditions;
};
export type TableRequest_Args_Select = {
    assoc?: boolean;
    selectColumns?: Array<[string, [string, any]]> | null;
    selectColumnNames?: Array<string> | null;
    where?: WhereConditions_Condition;
    orderBy?: Array<[string, boolean]>;
    groupBy?: Array<string> | null;
    limit?: [number, number] | null;
    join?: Array<TableRequest_Args_Join>;
    query_OrderBy?: string | null;
};
export type TableRequest_Args_Select_Parsed = {
    assoc: boolean;
    selectColumns: Array<[string, [string, any]]> | null;
    selectColumnNames: Array<string> | null;
    where: WhereConditions_Condition;
    orderBy: Array<[string, boolean]>;
    groupBy: Array<string> | null;
    limit: [number, number] | null;
    join: Array<TableRequest_Args_Join_Parsed>;
    query_OrderBy: string | null;
};
export type TableRequest_Args_Join = TableRequest_Args_Select & {
    on: Array<["string", "string"]>;
    prefix: string;
    tableDef: any;
    type?: "left" | "inner";
};
export type TableRequest_Args_Join_Parsed = TableRequest_Args_Select_Parsed & {
    on: Array<["string", "string"]>;
    prefix: string;
    tableDef: any;
    type: "left" | "inner";
};
export type WhereConditions = WhereConditions_Condition_Conjuction;
export type WhereConditions_Condition = WhereConditions_Condition_ConjuctionArray | WhereConditions_Condition_Conjuction | WhereConditions_Condition_Condition;
export type WhereConditions_Condition_ConjuctionArray = [
    logicOperator: "AND" | "OR",
    WhereConditions_Condition_Conjuction | WhereConditions_Condition_ConjuctionArray
];
export type WhereConditions_Condition_Conjuction = Array<WhereConditions_Condition>;
export type WhereConditions_Condition_Condition = [
    columnName: string,
    logicOperator: "<" | "<=" | "=" | ">=" | ">" | "IN" | null,
    value: TS0RawValue
];
