import ts0 from "@allblue/ts0"
import ABDAutoIncrementId from "./abd-fields/ABDAutoIncrementId.ts";
import DatabaseVersion from "./DatabaseVersion.ts";
import TableDef from "./TableDef.ts";
import FieldInfo from "./FieldInfo.ts";
import IndexInfo from "./IndexInfo.ts";

class TableInfo {
    #charset: string;
    #collation: string;
    #fieldInfos: Array<FieldInfo>;
    #indexInfos: {[indexName: string]: IndexInfo};
    #name: string;
    #primaryKeys: Array<string>;

    static GetQuery_Create(dbVersion: DatabaseVersion, tableDef: TableDef): string {
        let query = `CREATE TABLE \`${tableDef.name}\` (`;
        let fields = [];
        
        for (let [ columnName, column ] of tableDef.columns) {
            let field = column.field;
            let field_DBExtra = field.getDBExtra(dbVersion);
            fields.push(`\`${columnName}\` ` + field.getDBType(dbVersion) + 
                    (field.notNull ? ' NOT NULL' : ' NULL') +
                    (field_DBExtra === '' ? '' : ` ${field_DBExtra}`));
        }

        query += fields.join(', ');

        // let createPrimaryKeys = true;
        // console.log('Test', dbVersion);
        // if (dbVersion.type === 'sqlite') {
        //     for (let [ columnName, column ] of tableDef.columns) {
        //         console.log(column.field.__getType());
        //         if (column.field instanceof ABDAutoIncrementId) {
        //             console.log('False');
        //             createPrimaryKeys = false;
        //             break;
        //         }
        //     }
        // }
        // if (createPrimaryKeys)
        query += `, PRIMARY KEY (` + tableDef.pks.join(', ') + `)`;
        
        query += `)`;

        return query;
    }


    get fieldInfos(): Array<FieldInfo> {
        return this.#fieldInfos;
    }

    get indexInfos(): {[indexName: string]: IndexInfo} {
        return this.#indexInfos;
    }

    get name(): string {
        return this.#name;
    }

    get pks(): Array<string> {
        return this.#primaryKeys;
    }


    constructor(name: string) {
        this.#name = name;
        this.#fieldInfos = [];
        this.#indexInfos = {};
        this.#primaryKeys = [];
        this.#charset = 'utf8';
        this.#collation = 'utf8_general_ci';
    }

    addFieldInfo(fieldInfo: FieldInfo): void {
        this.#fieldInfos.push(fieldInfo);
    }

    addIndexInfo(indexName: string, indexInfo: IndexInfo): void {
        this.#indexInfos[indexName] = indexInfo;
    }

    getFieldInfo_ByName(fieldName: string): FieldInfo|null {
        for (let fieldInfo of this.fieldInfos) {
            if (fieldInfo.name === fieldName)
                return fieldInfo;
        }

        return null;
    }

    // setIndexes(indexes) {
    //     this.#indexInfos = new IndexInfos();
    //     for (let indexName in indexes) {
    //         for (let i = 0; i < indexes[indexName].length; i++) {
    //             let columnName = indexes[indexName][i][0];
    //             let desc = indexes[indexName][i][1];

    //             this.indexInfos.add(indexName, i, columnName, desc);
    //         }
    //     }
    // }

    setPKs(pks: Array<string>): TableInfo {
        for (let pk of pks) {
            let pkFound = false;
            for (let fieldInfo of this.#fieldInfos) {
                if (fieldInfo.name === pk) {
                    pkFound = true;
                    break;
                }
            }
            

            if (!pkFound)
                throw new Error(`PK '${pk}' does not exist in field infos.`);
        }

        this.#primaryKeys = pks;

        return this;
    }

}
export default TableInfo;