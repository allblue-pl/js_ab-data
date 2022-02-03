'use strict';

const
    js0 = require('js0')
;

class TableInfo
{

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
        this._primaryKeys = [];
    }

    addFieldInfo(fieldInfo)
    {
        js0.args(arguments, require('./FieldInfo'));

        this._fieldInfos.push(fieldInfo);
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
            fields.push(`${fieldInfo.name} ${fieldInfo.type} ` + 
                    (fieldInfo.notNull ? 'NOT NULL' : 'NULL'));
        }

        query += fields.join(', ');

        query += `, PRIMARY KEY (` + this._primaryKeys.join(',') + `)`;
        
        query += `)`;

        return query;
    }

    setPKs(primaryKeys)
    {
        js0.args(arguments, Array);

        this._primaryKeys = primaryKeys;

        return this;
    }

}
module.exports = TableInfo;