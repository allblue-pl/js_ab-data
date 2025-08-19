const
    js0 = require('js0')
;

class DataScheme {
    static get Version() {
        return [ 0, 0, 1 ];
    }


    get tableNames() {
        return this._tableDefs.keys();
    }

    get version() {
        return this._version;
    }


    constructor(version) {
        js0.args(arguments, 'int');

        this._version = version;
        this._requests = new Map();
        this._tableDefs = new Map();

        this._ignored_TableNames = [];
    }

    defR(requestName, requestDef) {
        this.defRequest(requestName, requestDef);

        return this;
    }

    defRequest(requestName, requestDef) {
        js0.args(arguments, 'string', require('./RequestDef'));

        if (this._requests.has(requestName))
            throw new Error(`Request '${requestName}' already exists.`);

        this._requests.set(requestName, requestDef);

        return this;
    }

    defT(tableDef) {
        if (tableDef.pks === null)
            throw new Error(`Table '${tableDef.name}' PKs not set.`);

        this.defTable(tableDef);

        return this;
    }

    defTable(tableDef) {
        js0.args(arguments, require('./TableDef'));

        this._validateTableId(tableDef.getTableId());

        if (this._tableDefs.has(tableDef.name))
            throw new Error(`Table '${tableName}' already exists.`);

        this._tableDefs.set(tableDef.name, tableDef);

        return this;
    }

    getIgnored_TableNames() {
        return this._ignored_TableNames;
    }

    getRequestDef(requestName) {
        if (!this.hasRequestDef(requestName))
            throw new Error(`RequestDef '${requestName}' does not exist.`);

        return this._requests.get(requestName);
    }

    getTableDef(tableName) {
        js0.args(arguments, 'string');

        for (let [ tableDefName, tableDef ] of this._tableDefs) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return tableDef;
        }

        throw new Error(`Table definition '${tableName}' does not exist.`);
    }

    getTableDef_ById(tableId) {
        js0.args(arguments, 'int');

        for (let [ tableDefName, tableDef ] of this._tableDefs) {
            if (tableDef.getTableId() === tableId)
                return tableDef;
        }

        throw new Error(`Table definition with id '${tableId}' does not exist.`);
    }

    getTableIds() {
        let tableIds = {};
        for (let tableName of this.tableNames) {
            let table = this.getTable(tableName);
            tableIds[tableName] = table.getTableId();
        }

        return tableIds;
    }

    getValidatorInfos() {
        let validatorInfos = {};
        for (let tableName of this.tableNames) {
            let table = this.getTable(tableName);
            validatorInfos[tableName] = table.getValidatorInfos();
        }

        return validatorInfos;
    }
    
    hasTable(tableName) {
        js0.args(arguments, 'string');

        for (let [ tableDefName, tableDef ] of this._tableDefs) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return true;
        }

        return false;
    }

    hasTable_ById(tableId) {
        js0.args(arguments, 'int');

        for (let [ tableDefName, tableDef ] of this._tableDefs) {
            if (tableDef.getTableId() === tableId)
                return true;
        }

        return false;
    }

    hasRequestDef(requestName) {
        return this._requests.has(requestName);
    }

    ignoreT(tableNames) {   
        js0.args(arguments, js0.Iterable('string'));

        this._ignored_TableNames = tableNames;

        return this;
    }  
    
    validateResponse(response, request) {
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

    validateResult(request, result) {
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

    validateRequest(request) {
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


    _validateTableId(tableId) {
        for (let [ tableName, table ] of this._tableDefs) {
            if (table.getTableId() === tableId)
                throw new Error(`Table with id '${tableId}' already exists ('${tableName}')`);
        }
    }

}
module.exports = DataScheme;