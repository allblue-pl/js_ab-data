import ABDField from "./abd-fields/ABDField.js";
import RequestDef from "./RequestDef.js";
import TableDef from "./TableDef.js";
import t, {                      } from "./abDataDefTypes.js";
import { t_SelectColumnType_Enum,                           } from "./SelectColumnType.js";
import { ts0, TS0PresetType,                                  } from "@allblue/ts0";
import abDataDefTypes from "./abDataDefTypes.js";

class TableRequestDef extends RequestDef {
    static Args_Delete()                  {
        return {
            where: [ t.TArray(null) ],
        };
    }

    /* Add suppport for recursive joins */
    static Args_Select()                  {
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

    static Assert_Args_Join(args                        )  
                                          {
        let presets = abDataDefTypes.parsePreset(TableRequestDef.Args_Select())
                .join;
        console.log("Join test", presets);
        return ts0.assertType                               (args, presets);
    }

    static Assert_Args_Select(args                          )  
                                            {
        let presets = abDataDefTypes.parsePreset(TableRequestDef.Args_Select());
        return ts0.assertType                                 (args, ts0.TPreset(presets));
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

                                        
                           
 

                                        
                    
                                                        
                                           
                                      
                                       
                                 
                                  
                                        
                               
  
                                               
                   
                                                       
                                          
                                     
                                      
                                
                                 
                                               
                              
  

                                                                 
                                    
                   
                  
                          
 

                                                                               
                                    
                   
                  
                         
 

                                                                   

                                        
                                              
                                         
                                        

                                                        
                                     
                                                 
                                                     
          
                                                   
                                         
                                                  
                                                                                             

let a                                      = ["Test", "IN", "B" ];
let test                  = [ [ "OR", [["Test", "IN", "B" ]]] ];
test.push([ "Test", "IN", "B" ]);