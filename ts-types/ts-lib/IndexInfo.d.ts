declare class IndexInfo {
    #private;
    get columnInfos(): IndexInfo_ColumnInfos;
    constructor();
    addColumnInfo(seq: number, columnName: string, desc: boolean): void;
    hasColumn(columnName: string): boolean;
}
export default IndexInfo;
type IndexInfo_ColumnInfos = Array<{
    seq: number;
    name: string;
    desc: boolean;
}>;
