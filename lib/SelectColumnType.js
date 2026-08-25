import abDataDefTypes from "./abDataDefTypes.js";

class SelectColumnType {
    static get $Values()                               {
        return [
            SelectColumnType.Bool,
            SelectColumnType.Float,
            SelectColumnType.Int,
            SelectColumnType.Long,
            SelectColumnType.JSON,
            SelectColumnType.String,
        ];
    }

    static get Bool()    { return 0; }
    static get Float()    { return 1; }
    static get Int()    { return 2; }
    static get Long()    { return 3; }
    static get JSON()    { return 4; }
    static get String()    { return 5; }
}
export default SelectColumnType;

                                   
                                  
                                   
                                 
                                  
                                  
                                   

export const t_SelectColumnType_Enum = abDataDefTypes.TEnum([ 0, 1, 2, 3, 4, 5, ]);