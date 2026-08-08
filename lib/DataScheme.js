import ts0, {                   } from "@allblue/ts0"
import RequestDef from "./RequestDef.js";
import TableDef, {                             } from "./TableDef.js";
                                                            
                                                                       
                                                              
                                                    
                                          

class DataScheme {
    #ignored_TableNames               ;
    #requestDefs                         ;
    #tableDefs                       ;
    #version        ;
    #validation         ;


    get tableNames()                {
        return this.#tableDefs.keys().toArray();
    }

    get requestNames()                {
        return this.#requestDefs.keys().toArray();
    }

    get version()         {
        return this.#version;
    }


    constructor(version        , validation          = true) {
        this.#version = version;
        this.#validation = validation;

        this.#requestDefs = new Map                    ();
        this.#tableDefs = new Map                  ();

        this.#ignored_TableNames = [];
    }

    defR(requestName        , requestDef            )             {
        this.defRequest(requestName, requestDef);

        return this;
    }

    defRequest(requestName        , requestDef            )             {
        if (this.#requestDefs.has(requestName))
            throw new Error(`Request '${requestName}' already exists.`);

        this.#requestDefs.set(requestName, requestDef);

        return this;
    }

    defT(tableDef          )             {
        if (tableDef.pks === null)
            throw new Error(`Table '${tableDef.name}' PKs not set.`);

        this.defTable(tableDef);

        return this;
    }

    defTable(tableDef          )             {
        this.#validateTableId(tableDef.getTableId());

        if (this.#tableDefs.has(tableDef.name))
            throw new Error(`Table '${tableDef.name}' already exists.`);

        this.#tableDefs.set(tableDef.name, tableDef);

        return this;
    }

    getIgnored_TableNames()                {
        return this.#ignored_TableNames.slice();
    }

    getRequestDef(requestName        )                   {
        let requestDef = this.#requestDefs.get(requestName);
        if (requestDef === undefined)
            throw new Error(`RequestDef '${requestName}' does not exist.`);

        return requestDef;
    }

    getTableDef(tableName        )           {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return tableDef;
        }

        throw new Error(`Table definition '${tableName}' does not exist.`);
    }

    getTableDef_ById(tableId        )           {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableDef.getTableId() === tableId)
                return tableDef;
        }

        throw new Error(`Table definition with id '${tableId}' does not exist.`);
    }

    getTableIds()                                {
        let tableIds                                = {};
        for (let tableName of this.tableNames) {
            let tableDef = this.getTableDef(tableName);
            tableIds[tableName] = tableDef.getTableId();
        }

        return tableIds;
    }

    getTableValidatorInfos()                                                {
        let tableValidatorInfos                                                = {};
        for (let tableName of this.tableNames) {
            let table = this.getTableDef(tableName);
            tableValidatorInfos[tableName] = table.getValidatorInfos();
        }

        return tableValidatorInfos;
    }
    
    hasTable(tableName        )          {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return true;
        }

        return false;
    }

    hasTable_ById(tableId        )          {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableDef.getTableId() === tableId)
                return true;
        }

        return false;
    }

    hasRequestDef(requestName        )          {
        return this.#requestDefs.has(requestName);
    }

    ignoreT(tableNames               )             {   
        this.#ignored_TableNames = tableNames;

        return this;
    }  
    
    // validateResponse(responseDataResults: ResponseDataResults, 
    //         request: Request): void|never {
    //     let requestId = request[0];
    //     let requestName = request[1];
    //     let actionName = request[2];
    //     let actionArgs = request[3];

    //     let requestDef = this.getRequestDef(requestName);
    //     let actionDef = requestDef.getActionDef(actionName);

    //     if (!(requestId in responseDataResults))
    //         throw new Error(`Result '${requestId}' not found in response.`);

    //     let errors: Array<string> = [];
    //     if (!ts0.checkType(responseDataResults[requestId], ts0.TPreset(
    //                 actionDef.resultDef), errors)) {
    //         console.error(`Result errors:`, errors);
    //         throw new Error(`Request action '${requestName}:${actionName}' result error.`);
    //     }
    // }

    validateRequestResponse(request                , response          )             {
        let requestId = request[0];
        let requestName = request[1];
        let actionName = request[2];

        let requestDef = this.getRequestDef(requestName);
        let actionDef = requestDef.getActionDef(actionName);

        let result = response.getResult(requestId);

        if (!result.isError()) {
            if (!ts0.checkType(result.data, ts0.TRawObject)) {
                console.error(`'${requestName}:${actionName}' result:`, result.data);
                throw new Error(`Result of '${requestName}:${actionName}' must be a 'RawObject'.`);
            }

            if (this.#validation) {
                // let errors: Array<string> = [];
                // if (!ts0.checkType(result.data, ts0.TPreset(actionDef.resultDef), errors)) {
                //     console.error(`'${requestName}:${actionName}' result:`, result.data);
                //     console.error(`Result errors:`, errors);
                //     throw new Error(`Request action '${requestName}:${actionName}' result error.`);
                // }
            }
        }
    }

    validateRequestArgs(request                )             {
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

        if (this.#validation) {
            // let errors: Array<string> = [];
            // if (!ts0.checkType(actionArgs, ts0.TPreset(actionDef.argsDef), errors)) {
            //     console.error(`Args errors:`, errors);
            //     throw new Error(`Request action '${requestName}:${actionName}' args error.`);
            // }
        }
    }


    #validateTableId(tableId        )       {
        for (let [ tableName, table ] of this.#tableDefs) {
            if (table.getTableId() === tableId)
                throw new Error(`Table with id '${tableId}' already exists ('${tableName}')`);
        }
    }

}
export default DataScheme;