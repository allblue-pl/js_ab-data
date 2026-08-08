import DataScheme from "./DataScheme.ts";
import DatabaseVersion from "./DatabaseVersion.ts";
import FieldInfo from "./FieldInfo.ts";
import TableDef, { type TableDef_IndexInfos } from "./TableDef.ts";
import TableInfo from "./TableInfo.ts";
import ABDField from "./abd-fields/ABDField.ts";
declare class DatabaseInfo {
    #private;
    static Compare(scheme: DataScheme, db_Info: DatabaseInfo): DatabaseInfo_DatabaseActions;
    static CompareIndexes(scheme: DataScheme, db_Info: DatabaseInfo): DatabaseInfo_DatabaseIndexActions;
    static Compare_Fields(columnName: string, scheme: DataScheme, scheme_TableDef: TableDef, scheme_Field: ABDField, db_Info: DatabaseInfo, tableInfo__DB: TableInfo, db_FieldInfo: FieldInfo): boolean;
    static Compare_Tables(scheme: DataScheme, scheme_TableDef: TableDef, db_Info: DatabaseInfo, db_TableInfo: TableInfo): DatabaseInfo_TableActions;
    static Compare_TableIndexes(scheme: DataScheme, scheme_TableDef: TableDef, db_Info: DatabaseInfo, db_TableInfo: TableInfo): DatabaseInfo_TableIndexActions;
    get dbVersion(): DatabaseVersion;
    get tableInfos(): Array<TableInfo>;
    constructor(dbVersion: DatabaseVersion);
    addTableInfo(tableInfo: TableInfo): void;
    getTableInfo_ByName(tableName: string): TableInfo | null;
}
export default DatabaseInfo;
export type DatabaseInfo_DatabaseActions = {
    tables: {
        delete: Array<string>;
        create: Array<TableDef>;
        alter: Array<DatabaseInfo_TableActions>;
    };
};
export type DatabaseInfo_DatabaseIndexActions = {
    tables: {
        delete: Array<string>;
        alter: Array<DatabaseInfo_TableIndexActions>;
        create: Array<string>;
    };
};
export type DatabaseInfo_TableActions = {
    tableDef: TableDef;
    delete: Array<string>;
    create: Array<{
        name: string;
        field: ABDField;
    }>;
    change: Array<{
        name: string;
        field: ABDField;
    }>;
};
export type DatabaseInfo_TableIndexActions = {
    tableDef: TableDef;
    pks_Delete: boolean;
    pks_Create: boolean;
    indexes_Delete: Array<string>;
    indexes_Create: TableDef_IndexInfos;
};
