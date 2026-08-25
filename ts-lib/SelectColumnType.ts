import abDataDefTypes from "./abDataDefTypes.ts";

class SelectColumnType {
    static get $Values(): Array<SelectColumnType_Type> {
        return [
            SelectColumnType.Bool,
            SelectColumnType.Float,
            SelectColumnType.Int,
            SelectColumnType.Long,
            SelectColumnType.JSON,
            SelectColumnType.String,
        ];
    }

    static get Bool(): 0 { return 0; }
    static get Float(): 1 { return 1; }
    static get Int(): 2 { return 2; }
    static get Long(): 3 { return 3; }
    static get JSON(): 4 { return 4; }
    static get String(): 5 { return 5; }
}
export default SelectColumnType;

export type SelectColumnType_Type =
    typeof SelectColumnType.Bool |
    typeof SelectColumnType.Float |
    typeof SelectColumnType.Int |
    typeof SelectColumnType.Long |
    typeof SelectColumnType.JSON |
    typeof SelectColumnType.String;

export const t_SelectColumnType_Enum = abDataDefTypes.TEnum([ 0, 1, 2, 3, 4, 5, ]);