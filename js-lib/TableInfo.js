'use strict';

const
    js0 = require('js0')
;

class TableInfo
{

    get autoIncrement() {
        return this._autoIncrement;
    }

    get fieldInfos() {
        return this._fieldInfos;
    }

    get name() {
        return this._name;
    }

    get pks() {
        return this._primaryKeys;
    }


    constructor(name)
    {
        js0.args(arguments, 'string');

        this._name = name;
        this._fieldInfos = [];
        this._autoIncrement = null;
        this._primaryKeys = null;
    }

    addFieldInfo(fieldInfo)
    {
        js0.args(arguments, require('./FieldInfo'));

        this._fieldInfos.push(fieldInfo);
    }

    addIndex(indexName, columns)
    {
        throw new Error('Not implemented.');
    }

    getFieldInfo_ByName(fieldName)
    {
        for (let fieldInfo of this.fieldInfos) {
            if (fieldInfo.name === fieldName)
                return fieldInfo;
        }

        return null;
    }

    getQuery_Create()
    {
        let query = `CREATE TABLE ${this.name} (`;
        let fields = [];

        for (let fieldInfo of this.fieldInfos) {
            fields.push(`${fieldInfo.name} ${fieldInfo.types[0]} ` + 
                    (fieldInfo.notNull ? 'NOT NULL' : 'NULL'));
        }

        query += fields.join(', ');

        if (this._primaryKeys !== null)
            query += `, PRIMARY KEY (` + this._primaryKeys.join(',') + `)`;
        
        query += `)`;

        return query;
    }

    setAutoIncrement(columnName)
    {
        js0.args(arguments, [ 'string', js0.Null ]);

        this._autoIncrement = columnName;
        this._primaryKeys = null;

        return this;
    }

    setPKs(pks)
    {
        js0.args(arguments, [ Array, js0.Null ]);

        this._autoIncrement = null;
        this._primaryKeys = pks;

        return this;
    }

}
module.exports = TableInfo;