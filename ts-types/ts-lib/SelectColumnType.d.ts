declare class SelectColumnType {
    static get $Values(): Array<SelectColumnType_Type>;
    static get Bool(): 0;
    static get Float(): 1;
    static get Int(): 2;
    static get Long(): 3;
    static get JSON(): 4;
    static get String(): 5;
}
export default SelectColumnType;
export type SelectColumnType_Type = typeof SelectColumnType.Bool | typeof SelectColumnType.Float | typeof SelectColumnType.Int | typeof SelectColumnType.Long | typeof SelectColumnType.JSON | typeof SelectColumnType.String;
export declare const t_SelectColumnType_Enum: import("./abDataDefTypes.ts").ABDataDefEnumType;
