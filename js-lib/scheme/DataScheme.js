'use strict';

const
    js0 = require('js0'),

    DatabaseInfo = require('../DatabaseInfo'),
    FieldInfo = require('../FieldInfo'),
    TableInfo = require('../TableInfo')
;

class DataScheme
{

    get tableNames() {
        return this._tables.keys();
    }

    get version() {
        return this._version;
    }


    constructor(version)
    {
        js0.args(arguments, 'int');

        this._version = version;
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
                    field,
                    FieldInfo.GetType_FromField(field),
                    '',
                    field.properties.notNull
                );
                tableInfo.addFieldInfo(fieldInfo);
            }

            tableInfo.setPKs(table.pks);

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

        this._validateTableId(table.getTableId());

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

    getTable_ById(tableId)
    {
        for (let [ tableName, table ] of this._tables) {
            if (table.getTableId() === tableId)
                return table;
        }

        throw new Error(`Table with id '${tableId}' does not exist.`);
    }
    
    hasTable(tableName)
    {
        js0.args(arguments, 'string');

        return this._tables.has(tableName);
    }

    hasTable_ById(tableId)
    {
        js0.args(arguments, 'int');

        for (let [ tableName, table ] of this._tables) {
            if (table.getTableId() === tableId)
                return true;
        }

        return false;
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
    
    validateResponse(response, request)
    {
        if (response === null)
            return;

        let requestId = request[0];
        let requestName = request[1];
        let actionName = request[2];
        let actionArgs = request[3];

        let requestDef = this.getRequestDef(requestName);
        let actionDef = requestDef.getActionDef(actionName);

        if (!(requestId in response))
            throw new Error(`Result '${requestId}' not found in response.`);

        let errors = [];
        if (!js0.type(response[requestId], js0.Preset(actionDef.resultDef), errors)) {
            console.error(`Result errors:`, errors);
            throw new Error(`Request action '${requestName}:${actionName}' result error.`);
        }
    }

    validateResult(request, result)
    {
        let requestId = request[0];
        let requestName = request[1];
        let actionName = request[2];
        let actionArgs = request[3];

        let requestDef = this.getRequestDef(requestName);
        let actionDef = requestDef.getActionDef(actionName);

        if (!js0.type(result, js0.RawObject)) {
            console.error(`'${requestName}:${actionName}' result:`, result);
            throw new Error(`Result of '${requestName}:${actionName}' must be a 'RawObject'.`);
        }

        let errors = [];
        if (!js0.type(result, js0.Preset(actionDef.resultDef), errors)) {
            console.error(`'${requestName}:${actionName}' result:`, result);
            console.error(`Result errors:`, errors);``
            throw new Error(`Request action '${requestName}:${actionName}' result error.`);
        }
    }

    validateRequest(request)
    {
        let requestId = request[0];
        let requestName = request[1];
        let actionName = request[2];
        let actionArgs = request[3];

        if (!this.hasRequestDef(requestName))
            throw new Error(`Request '${requestName}' not defined.`);
        
        let requestDef = this.getRequestDef(requestName);

        if (!requestDef.hasActionDef(actionName))
            throw new Error(`Action '${requestName}:${actionName}' not defined.`);

        let actionDef = requestDef.getActionDef(actionName);
        let errors = [];
        if (!js0.type(actionArgs, js0.Preset(actionDef.argsDef), errors)) {
            console.error(`Args errors:`, errors);
            throw new Error(`Request action '${requestName}:${actionName}' args error.`);
        }
    }


    _validateTableId(tableId)
    {
        for (let [ tableName, table ] of this._tables) {
            if (table.getTableId() === tableId)
                throw new Error(`Table with id '${tableId}' already exists ('${tableName}')`);
        }
    }

}
module.exports = DataScheme;