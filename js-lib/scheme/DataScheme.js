'use strict';

const
    js0 = require('js0'),

    DatabaseInfo = require('../DatabaseInfo'),
    FieldInfo = require('../FieldInfo'),
    TableInfo = require('../TableInfo')
;

class DataScheme
{

    get tables() {
        return this._tables;
    }


    constructor()
    {
        js0.args(arguments);

        this._requests = new Map();
        this._tables = new Map();

        this._ignored_TableNames = [];
    }

    createDatabaseInfo()
    {
        let databaseInfo = new DatabaseInfo();

        for (let [ tableName, table ] of this._tables) {
            let tableInfo = new TableInfo(table.name);
            for (let [ fieldName, column ] of table.columns) {
                let field = column.field;
                let fieldInfo = new FieldInfo(
                    fieldName,
                    FieldInfo.GetType_FromField(field),
                    '',
                    field.properties.notNull,
                );
                tableInfo.addFieldInfo(fieldInfo);
            }

            tableInfo.setPrimaryKey(table.primaryKey);

            databaseInfo.addTableInfo(tableInfo);
        }

        return databaseInfo;
    }

    defR(requestName, requestClass)
    {
        this.defRequest(requestName, requestClass);

        return this;
    }

    defRequest(requestName, requestClass)
    {
        js0.args(arguments, 'string', 'function');

        let request = new requestClass();
        if (!(request instanceof require('./RequestDef')))
            throw new Error(`'requestClass' must inherit from 'scheme.Request'.`);

        if (this._requests.has(requestName))
            throw new Error(`Request '${requestName}' already exists.`);

        this._requests.set(requestName, request);

        return this;
    }

    defT(tableName, table)
    {
        this.defTable(tableName, table);

        return this;
    }

    defTable(tableName, table)
    {
        js0.args(arguments, 'string', require('../Table'));

        if (this._tables.has(tableName))
            throw new Error(`Table '${tableName}' already exists.`);

        this._tables.set(tableName, table);

        return this;
    }

    getIgnored_TableNames()
    {
        return this._ignored_TableNames;
    }

    getRequestDef(requestName)
    {
        if (!this.hasRequestDef(requestName))
            throw new Error(`RequestDef '${requestName}' does not exist.`);

        return this._requests.get(requestName);
    }

    getT(tableName)
    {
        return this.getTable(tableName);
    }

    getTable(tableName)
    {
        js0.args(arguments, 'string');

        if (!(this._tables.has(tableName)))
            throw new Error(`Table '${tableName}' does not exist.`);

        return this._tables.get(tableName);
    }
    
    hasTable(tableName)
    {
        js0.args(arguments, 'string');

        return this._tables.has(tableName);
    }

    hasRequestDef(requestName)
    {
        return this._requests.has(requestName);
    }

    ignoreT(tableNames)
    {   
        js0.args(arguments, js0.Iterable('string'));

        this._ignored_TableNames = tableNames;

        return this;
    }       

}
module.exports = DataScheme;