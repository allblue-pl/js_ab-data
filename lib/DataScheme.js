import ts0, {                   } from "@allblue/ts0"
import RequestDef from "./RequestDef.js";
import TableDef, {                             } from "./TableDef.js";
                                                            
                                                                       
                                                              
                                                    
                                          
import { ABDataDefObjectPresetType,                                               } from "./abDataDefTypes.js";
                                                        
                                                             
import ABDField from "./abd-fields/ABDField.js";

class DataScheme {
    #ignored_TableNames               ;
    #requestDefs                         ;
    #tableDefs                       ;
    #tableDefVariants                              ;
    #typeDefs               
                               
                            
      ;
    #layoutDefs                                        ;
    #version        ;
    #validation         ;


    get layoutNames()                {
        return this.#layoutDefs.keys().toArray();
    }

    get tableNames()                {
        return this.#tableDefs.keys().toArray();
    }

    get tableVariantNames()                {
        return this.#tableDefVariants.keys().toArray();
    }

    get typeNames()                {
        return this.#typeDefs.keys().toArray();
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

        this.#requestDefs = new Map();
        this.#tableDefs = new Map();
        this.#tableDefVariants = new Map();
        this.#typeDefs = new Map();
        this.#layoutDefs = new Map();

        this.#ignored_TableNames = [];
    }

    defL(layoutName        , defPreset                 )             {
        this.defLayout(layoutName, defPreset);

        return this;
    }

    defLayout(layoutName        , defPreset                 )             {
        if (this.#layoutDefs.has(layoutName))
            throw new Error(`Layout '${layoutName}' already exists.`);

        this.#layoutDefs.set(layoutName, new ABDataDefObjectPresetType(defPreset));

        return this;
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

    defTable(tableDef          )             {
        for (let [ tableName, tableDef_T ] of this.#tableDefs) {
            if (tableDef_T.id === tableDef.id) {
                throw new Error(`Cannot define table '${tableDef.name}'.` +
                        ` Id '${tableDef.id}' already exists in '${tableDef_T.name}'.`);
            }
            if (tableDef_T.name === tableDef.name) {
                throw new Error(`Cannot define table '${tableName}'.` +
                        ` Name '${tableDef.name}' already exists.`);
            }
            if (tableDef_T.alias === tableDef.alias) {
                throw new Error(`Cannot define table '${tableDef.name}'.` +
                        ` Id '${tableDef.alias}' already exists in '${tableDef_T.name}'.`);
            }
        }

        if (tableDef.pks === null)
            throw new Error(`Table '${tableDef.name}' PKs not set.`);

        // this.#validateTableId(tableDef.id);
        // this.#validateTableName(tableDef.name);
        // this.#validateTableAlias(tableDef.alias);

        this.#tableDefs.set(tableDef.name, tableDef);

        return this;
    }

    defTableVariant(tableDefVariant                 )             {
        this.#tableDefVariants.set(tableDefVariant.name, tableDefVariant);

        return this;
    }

    defType(typeName        , typeDef                    , 
            requestArg          = false)             {
        this.#typeDefs.set(typeName, {
            def: typeDef,
            requestArg: requestArg,
        });

        return this;
    }

    defTypes(prefix        , typeDefs                                     )             {
        for (let typeName in typeDefs)
            this.defType(`${prefix}_${typeName}`, typeDefs[typeName]);

        return this;
    }

    getIgnored_TableNames()                {
        return this.#ignored_TableNames.slice();
    }

    getLayoutDef(layoutName        )                            {
        for (let [ layoutName_T, layoutDef ] of this.#layoutDefs) {
            if (layoutName_T.toLowerCase() === layoutName.toLowerCase())
                return layoutDef;
        }

        throw new Error(`Layout definition '${layoutName}' does not exist.`);
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
            if (tableDef.id === tableId)
                return tableDef;
        }

        throw new Error(`Table definition with id '${tableId}' does not exist.`);
    }

    getTableDefVariant(tableName        )                  {
        for (let [ tableDefName, tableDefVariant ] of this.#tableDefVariants) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return tableDefVariant;
        }

        throw new Error(`Table definition variant '${tableName}' does not exist.`);
    }

    getTableIds()                                {
        let tableIds                                = {};
        for (let tableName of this.tableNames) {
            let tableDef = this.getTableDef(tableName);
            tableIds[tableName] = tableDef.id;
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

    getTypeInfo(typeName        )                                                   {
        let typeDef = this.#typeDefs.get(typeName);
        if (typeDef === undefined)
            throw new Error(`Type definition '${typeName}' does not exist.`);

        return typeDef;
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
            if (tableDef.id === tableId)
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

    parseField(field                       )           {
        if (field instanceof ABDField)
            return field;

        return this.parseField(this.getTableDef(field.tableName)
                .getColumn(field.columnName).field);
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
        let requestName = request[1][0];
        let actionName = request[1][1];

        let requestDef = this.getRequestDef(requestName);
        let actionDef = requestDef.getActionDef(actionName);

        let result = response.getActionResult(requestId);

        if (!result.isError()) {
            if (!ts0.checkType(result.getData_Result(), ts0.TRawObject)) {
                console.error(`'${requestName}:${actionName}' result:`, 
                        result.getData_Raw());
                throw new Error(`Result of '${requestName}:${actionName}' must be a 'RawObject'.`);
            }

            if (this.#validation) {
                throw new Error("Validation not implemented.");
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
        let requestName = request[1][0];
        let actionName = request[1][1];
        let actionArgs = request[1][2];

        if (!this.hasRequestDef(requestName))
            throw new Error(`Request '${requestName}' not defined.`);
        
        let requestDef = this.getRequestDef(requestName);

        if (!requestDef.hasActionDef(actionName))
            throw new Error(`Action '${requestName}:${actionName}' not defined.`);

        let actionDef = requestDef.getActionDef(actionName);

        if (this.#validation) {
            throw new Error("Validation not implemented.");
            // let errors: Array<string> = [];
            // if (!ts0.checkType(actionArgs, ts0.TPreset(actionDef.argsDef), errors)) {
            //     console.error(`Args errors:`, errors);
            //     throw new Error(`Request action '${requestName}:${actionName}' args error.`);
            // }
        }
    }


    // #validateTableAlias(tableAlias: string): void|never {
    //     for (let [ tableName, table ] of this.#tableDefs) {
    //         if (table.alias === tableAlias)
    //             throw new Error(`Table with alias '${tableAlias}' already exists ('${tableName}').`);
    //     }
    // }

    // #validateTableName(tableName: string): void|never {
    //     if (this.#tableDefs.has(tableName))
    //         throw new Error(`Table with name '${tableName}' already exists.`);
    // }

    // #validateTableId(tableId: number): void|never {
    //     for (let [ tableName, table ] of this.#tableDefs) {
    //         if (table.id === tableId)
    //             throw new Error(`Table with id '${tableId}' already exists ('${tableName}').`);
    //     }
    // }
}
export default DataScheme;