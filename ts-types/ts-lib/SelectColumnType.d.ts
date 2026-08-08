declare class SelectColumnType {
    static get $Values(): Array<SelectColumnType_Type>;
    static get Bool(): number;
    static get Float(): number;
    static get Int(): number;
    static get Long(): number;
    static get JSON(): number;
    static get String(): number;
}
export default SelectColumnType;
export type SelectColumnType_Type = typeof SelectColumnType.Bool | typeof SelectColumnType.Float | typeof SelectColumnType.Int | typeof SelectColumnType.Long | typeof SelectColumnType.JSON | typeof SelectColumnType.String;
