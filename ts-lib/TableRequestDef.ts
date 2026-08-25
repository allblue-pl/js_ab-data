import ABDField from "./abd-fields/ABDField.ts";
import RequestDef from "./RequestDef.ts";
import TableDef from "./TableDef.ts";
import t, { type ABDataDefPreset } from "./abDataDefTypes.ts";
import { t_SelectColumnType_Enum, type SelectColumnType_Type} from "./SelectColumnType.ts";
import { ts0, TS0PresetType, type TS0Preset, type TS0RawValue } from "@allblue/ts0";
import abDataDefTypes from "./abDataDefTypes.ts";

class TableRequestDef extends RequestDef {
    static Args_Delete(): ABDataDefPreset {
        return {
            where: [ t.TArray(null) ],
        };
    }

    /* Add suppport for recursive joins */
    static Args_Select(): ABDataDefPreset {
        return {
            assoc: [ "bool", t.TDefault(true) ],
            selectColumns: [ t.TArray(t.TArrayPreset(
                    [ "string", t.TArrayPreset([ "string", null /* ABDField */ ]) ])), 
                    t.TNull, t.TDefault(null) ],
            selectColumnNames: [ t.TArray("string"), t.TNull, t.TDefault(null) ],
            where: [ t.TArray(null), t.TDefault([]) ],
            orderBy: [ t.TArray(t.TArrayPreset([ "string", "bool" ])), 
                    t.TDefault([]) ],
            groupBy: [ t.TArray("string"), t.TNull, t.TDefault(null) ],
            limit: [ t.TArrayPreset([ "int", "int" ]), t.TNull, 
                    t.TDefault(null) ],
            join: [ t.TArray(t.TObjectPreset({
                selectColumns: [ t.TArray(t.TArrayPreset(
                        [ "string", t.TArrayPreset([ "string", null /* ABDField */ ]) ])), 
                        t.TNull, t.TDefault(null) ],
                selectColumnNames: [ t.TArray("string"), t.TNull, t.TDefault(null) ],
                type: [ t.TEnum([ "left", "inner" ]), t.TDefault("left") ],
                prefix: "string",
                tableDef: null /* TableDef */,
                on: t.TArray(t.TArrayPreset([ "string", "string" ])),
                where: [ t.TArray(null), t.TDefault([]) ],
                orderBy: [ t.TArray(t.TArrayPreset([ "string", "bool" ])), 
                        t.TDefault([]) ],
                groupBy: [ t.TArray("string"), t.TNull, t.TDefault(null) ],
                query_OrderBy: [ "string", t.TNull, t.TDefault(null) ],
                })), t.TDefault([])
            ],
            query_OrderBy: [ "string", t.TNull, t.TDefault(null) ],
                // query_Where: [ "string", t.TNull, t.TDefault(null) ],
        };
    }

    static Assert_Args_Join(args: TableRequest_Args_Join): 
            TableRequest_Args_Join_Parsed {
        let presets = abDataDefTypes.parsePreset(TableRequestDef.Args_Select())
                .join;
        console.log("Join test", presets);
        return ts0.assertType<TableRequest_Args_Join_Parsed>(args, presets);
    }

    static Assert_Args_Select(args: TableRequest_Args_Select): 
            TableRequest_Args_Select_Parsed {
        let presets = abDataDefTypes.parsePreset(TableRequestDef.Args_Select());
        return ts0.assertType<TableRequest_Args_Select_Parsed>(args, ts0.TPreset(presets));
    }


    constructor(readOnly = false) {
        super();
        
        this
            .defA("row", "r",
                TableRequestDef.Args_Select(), {
                row: [ t.TArray(null), t.TNull ],
                
                success: "bool",
                error: [ "string", t.TNull ],
            })
            .defA("select", "r",
                TableRequestDef.Args_Select(), {
                rows: [ t.TArray(null), t.TNull ],

                success: "bool",
                error: [ "string", t.TNull ],
            })

        if (!readOnly) {
            this
                .defA("delete", "w", {
                    where: t.TArray(t.TArray(null)),
                }, {
                    error: [ "string", t.TNull ],
                })
                .defA("set", "w", {
                    row: t.TObject("string", null),
                }, {
                    error: [ "string", t.TNull ],
                })
                .defA("update", "w", {
                    rows: t.TArray(null),
                    keys: t.TArray("string"),
                }, {
                    error: [ "string", t.TNull ],
                });
        }
    }
}
export default TableRequestDef;

export type TableRequest_Args_Delete = {
    where: WhereConditions,
}

export type TableRequest_Args_Select = {
    assoc?: boolean,
    selectColumns?: Array<[string, [string, any]]>|null,
    selectColumnNames?: Array<string>|null,
    where?: WhereConditions_Condition,
    orderBy?: Array<[string, boolean]>,
    groupBy?: Array<string>|null,
    limit?: [number, number]|null,
    join?: Array<TableRequest_Args_Join>
    query_OrderBy?: string|null
};
export type TableRequest_Args_Select_Parsed = {
    assoc: boolean,
    selectColumns: Array<[string, [string, any]]>|null,
    selectColumnNames: Array<string>|null,
    where: WhereConditions_Condition,
    orderBy: Array<[string, boolean]>,
    groupBy: Array<string>|null,
    limit: [number, number]|null,
    join: Array<TableRequest_Args_Join_Parsed>,
    query_OrderBy: string|null
};

export type TableRequest_Args_Join = TableRequest_Args_Select & {
    on: Array<["string", "string"]>,
    prefix: string,
    tableDef: any,
    type?: "left"|"inner",
}

export type TableRequest_Args_Join_Parsed = TableRequest_Args_Select_Parsed & {
    on: Array<["string", "string"]>,
    prefix: string,
    tableDef: any,
    type: "left"|"inner",
}

export type WhereConditions = WhereConditions_Condition_Conjuction;

export type WhereConditions_Condition = 
    WhereConditions_Condition_ConjuctionArray|
    WhereConditions_Condition_Conjuction|
    WhereConditions_Condition_Condition;

export type WhereConditions_Condition_ConjuctionArray = 
        [ logicOperator: "AND"|"OR", 
            WhereConditions_Condition_Conjuction|
            WhereConditions_Condition_ConjuctionArray
        ];
export type WhereConditions_Condition_Conjuction = 
        Array<WhereConditions_Condition>;
export type WhereConditions_Condition_Condition = 
    [columnName: string, logicOperator: "<"|"<="|"="|">="|">"|"IN"|null, value: TS0RawValue];

let a: WhereConditions_Condition_Condition = ["Test", "IN", "B" ];
let test: WhereConditions = [ [ "OR", [["Test", "IN", "B" ]]] ];
test.push([ "Test", "IN", "B" ]);