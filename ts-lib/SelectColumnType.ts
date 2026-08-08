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

    static get Bool(): number { return 0; }
    static get Float(): number { return 1; }
    static get Int(): number { return 2; }
    static get Long(): number { return 3; }
    static get JSON(): number { return 4; }
    static get String(): number { return 5; }
}
export default SelectColumnType;

export type SelectColumnType_Type =
    typeof SelectColumnType.Bool |
    typeof SelectColumnType.Float |
    typeof SelectColumnType.Int |
    typeof SelectColumnType.Long |
    typeof SelectColumnType.JSON |
    typeof SelectColumnType.String;