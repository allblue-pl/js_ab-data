import ABDField from "./abd-fields/ABDField.ts";
import RequestDef from "./RequestDef.ts";
import TableDef from "./TableDef.ts";
import t, { type ABDataDefPreset } from "./abDataDefTypes.ts";

class TableRequestDef extends RequestDef {
    static Args_Delete(): ABDataDefPreset {
        return {
            where: [ t.TArray(null), t.TDefault([]) ],
        };
    }

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
                    })), t.TDefault([]) ],
                query_OrderBy: [ "string", t.TNull, t.TDefault(null) ],
                // query_Where: [ "string", t.TNull, t.TDefault(null) ],
        };
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
                    success: "bool",
                    error: [ "string", t.TNull ],
                })
                .defA("set", "w", {
                    row: t.TObject("string", null),
                }, {
                    success: "bool",
                    error: [ "string", t.TNull ],
                })
                .defA("update", "w", {
                    rows: t.TArray(null),
                    keys: t.TArray("string"),
                }, {
                    success: "bool",
                    error: [ "string", t.TNull ],
                });
        }
    }
}
export default TableRequestDef;