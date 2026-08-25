import DatabaseVersion from "./DatabaseVersion.ts";
import TableDef from "./TableDef.ts";
import DBFieldInfo from "./FieldInfo.ts";
import IndexInfo from "./IndexInfo.ts";
declare class TableInfo {
    #private;
    static GetQuery_Create(dbVersion: DatabaseVersion, tableDef: TableDef): string;
    get fieldInfos(): Array<DBFieldInfo>;
    get indexInfos(): {
        [indexName: string]: IndexInfo;
    };
    get name(): string;
    get pks(): Array<string>;
    constructor(name: string);
    addFieldInfo(fieldInfo: DBFieldInfo): void;
    addIndexInfo(indexName: string, indexInfo: IndexInfo): void;
    getFieldInfo_ByName(fieldName: string): DBFieldInfo | null;
    setPKs(pks: Array<string>): TableInfo;
}
export default TableInfo;
