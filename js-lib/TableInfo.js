'use strict';

const
    js0 = require('js0')
;

class TableInfo {
    static GetQuery_Create(dbVersion, tableDef) {
        js0.args(arguments, require('./DatabaseVersion'), require('./TableDef'));

        let query = `CREATE TABLE ${tableDef.name} (`;
        let fields = [];
        
        for (let [ columnName, column ] of tableDef.columns) {
            let field = column.field;
            let field_DBExtra = field.getDBExtra(dbVersion);
            fields.push(`${columnName} ` + field.getDBType(dbVersion) + 
                    (field.notNull ? ' NOT NULL' : ' NULL') +
                    (field_DBExtra === '' ? '' : ` ${field_DBExtra}`));
        }

        query += fields.join(', ');

        query += `, PRIMARY KEY (` + tableDef.pks.join(', ') + `)`;
        
        query += `)`;

        return query;
    }


    get fieldInfos() {
        return this._fieldInfos;
    }

    get indexInfos() {
        return this._indexInfos;
    }

    get name() {
        return this._name;
    }

    get pks() {
        return this._primaryKeys;
    }


    constructor(name) {
        js0.args(arguments, 'string');

        this._name = name;
        this._fieldInfos = [];
        this._indexInfos = {};
        this._primaryKeys = null;
        this._charset = 'utf8';
        this._collation = 'utf8_general_ci';
    }

    addFieldInfo(fieldInfo) {
        js0.args(arguments, require('./FieldInfo'));

        this._fieldInfos.push(fieldInfo);
    }

    addIndexInfo(indexName, indexInfo) {
        js0.args(arguments, 'string', require('./IndexInfo'));

        this._indexInfos[indexName] = indexInfo;
    }

    getFieldInfo_ByName(fieldName) {
        for (let fieldInfo of this.fieldInfos) {
            if (fieldInfo.name === fieldName)
                return fieldInfo;
        }

        return null;
    }

    // setIndexes(indexes) {
    //     js0.args(arguments, js0.ObjectItems(js0.ArrayItems(
    //             js0.PresetArray([ 'string', 'boolean' ]))));

    //     this._indexInfos = new IndexInfos();
    //     for (let indexName in indexes) {
    //         for (let i = 0; i < indexes[indexName].length; i++) {
    //             let columnName = indexes[indexName][i][0];
    //             let desc = indexes[indexName][i][1];

    //             this.indexInfos.add(indexName, i, columnName, desc);
    //         }
    //     }
    // }

    setPKs(pks) {
        js0.args(arguments, js0.ArrayItems('string'));

        for (let pk of pks) {
            let pkFound = false;
            for (let fieldInfo of this._fieldInfos) {
                if (fieldInfo.name === pk) {
                    pkFound = true;
                    break;
                }
            }

            if (!pkFound)
                throw new Error(`PK '${pk}' does not exist in field infos.`);
        }

        this._primaryKeys = pks;

        return this;
    }

}
module.exports = TableInfo;