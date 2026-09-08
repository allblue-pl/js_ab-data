import ts0, { type TS0ValueType } from "@allblue/ts0"
import RequestDef from "./RequestDef.ts";
import TableDef, { type TableDef_ValidatorInfo } from "./TableDef.ts";
import type { Request_Parsed } from "./RequestProcessor.ts";
import type { ResponseData, ResponseDataResults } from "./Response.ts";
import type { ResponseResultData } from "./ResponseResult.ts";
import type { ValidatorInfo } from "./Validator.ts";
import type Response from "./Response.ts";
import type { ABDataDefValueType } from "./abDataDefTypes.ts";
import type TableDefVariant from "./TableDefVariant.ts";
import type ABDColumnRef from "./abd-fields/ABDColumnRef.ts";
import ABDField from "./abd-fields/ABDField.ts";

class DataScheme {
    #ignored_TableNames: Array<string>;
    #requestDefs: Map<string, RequestDef>;
    #tableDefs: Map<string, TableDef>;
    #tableDefVariants: Map<string, TableDefVariant>;
    #typeDefs: Map<string, {
        def: ABDataDefValueType
        requestArg: boolean,
    }>;
    #version: number;
    #validation: boolean;


    get tableNames(): Array<string> {
        return this.#tableDefs.keys().toArray();
    }

    get tableVariantNames(): Array<string> {
        return this.#tableDefVariants.keys().toArray();
    }

    get typeNames(): Array<string> {
        return this.#typeDefs.keys().toArray();
    }

    get requestNames(): Array<string> {
        return this.#requestDefs.keys().toArray();
    }

    get version(): number {
        return this.#version;
    }


    constructor(version: number, validation: boolean = true) {
        this.#version = version;
        this.#validation = validation;

        this.#requestDefs = new Map();
        this.#tableDefs = new Map();
        this.#tableDefVariants = new Map();
        this.#typeDefs = new Map();

        this.#ignored_TableNames = [];
    }

    defR(requestName: string, requestDef: RequestDef): DataScheme {
        this.defRequest(requestName, requestDef);

        return this;
    }

    defRequest(requestName: string, requestDef: RequestDef): DataScheme {
        if (this.#requestDefs.has(requestName))
            throw new Error(`Request '${requestName}' already exists.`);

        this.#requestDefs.set(requestName, requestDef);

        return this;
    }

    defTable(tableDef: TableDef): DataScheme {
        if (tableDef.pks === null)
            throw new Error(`Table '${tableDef.name}' PKs not set.`);

        this.#validateTableId(tableDef.getTableId());
        this.#validateTableName(tableDef.name);
        this.#validateTableAlias(tableDef.alias);

        this.#tableDefs.set(tableDef.name, tableDef);

        return this;
    }

    defTableVariant(tableDefVariant: TableDefVariant): DataScheme {
        this.#tableDefVariants.set(tableDefVariant.name, tableDefVariant);

        return this;
    }

    defType(typeName: string, typeDef: ABDataDefValueType, 
            requestArg: boolean = false): DataScheme {
        this.#typeDefs.set(typeName, {
            def: typeDef,
            requestArg: requestArg,
        });

        return this;
    }

    getIgnored_TableNames(): Array<string> {
        return this.#ignored_TableNames.slice();
    }

    getRequestDef(requestName: string): RequestDef|never {
        let requestDef = this.#requestDefs.get(requestName);
        if (requestDef === undefined)
            throw new Error(`RequestDef '${requestName}' does not exist.`);

        return requestDef;
    }

    getTableDef(tableName: string): TableDef {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return tableDef;
        }

        throw new Error(`Table definition '${tableName}' does not exist.`);
    }

    getTableDef_ById(tableId: number): TableDef {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableDef.getTableId() === tableId)
                return tableDef;
        }

        throw new Error(`Table definition with id '${tableId}' does not exist.`);
    }

    getTableDefVariant(tableName: string): TableDefVariant {
        for (let [ tableDefName, tableDefVariant ] of this.#tableDefVariants) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return tableDefVariant;
        }

        throw new Error(`Table definition variant '${tableName}' does not exist.`);
    }

    getTableIds(): {[tableName: string]: number} {
        let tableIds: {[tableName: string]: number} = {};
        for (let tableName of this.tableNames) {
            let tableDef = this.getTableDef(tableName);
            tableIds[tableName] = tableDef.getTableId();
        }

        return tableIds;
    }

    getTableValidatorInfos(): {[tableName: string]: TableDef_ValidatorInfo} {
        let tableValidatorInfos: {[tableName: string]: TableDef_ValidatorInfo} = {};
        for (let tableName of this.tableNames) {
            let table = this.getTableDef(tableName);
            tableValidatorInfos[tableName] = table.getValidatorInfos();
        }

        return tableValidatorInfos;
    }

    getTypeInfo(typeName: string): { def: ABDataDefValueType, requestArg: boolean } {
        let typeDef = this.#typeDefs.get(typeName);
        if (typeDef === undefined)
            throw new Error(`Type definition '${typeName}' does not exist.`);

        return typeDef;
    }
    
    hasTable(tableName: string): boolean {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableName.toLowerCase() === tableDefName.toLowerCase())
                return true;
        }

        return false;
    }

    hasTable_ById(tableId: number): boolean {
        for (let [ tableDefName, tableDef ] of this.#tableDefs) {
            if (tableDef.getTableId() === tableId)
                return true;
        }

        return false;
    }

    hasRequestDef(requestName: string): boolean {
        return this.#requestDefs.has(requestName);
    }

    ignoreT(tableNames: Array<string>): DataScheme {   
        this.#ignored_TableNames = tableNames;

        return this;
    }

    parseField(field: ABDField|ABDColumnRef): ABDField {
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

    validateRequestResponse(request: Request_Parsed, response: Response): void|never {
        let requestId = request[0];
        let requestName = request[1][0];
        let actionName = request[1][1];

        let requestDef = this.getRequestDef(requestName);
        let actionDef = requestDef.getActionDef(actionName);

        let result = response.getActionResult(requestId);

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

    validateRequestArgs(request: Request_Parsed): void|never {
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
            // let errors: Array<string> = [];
            // if (!ts0.checkType(actionArgs, ts0.TPreset(actionDef.argsDef), errors)) {
            //     console.error(`Args errors:`, errors);
            //     throw new Error(`Request action '${requestName}:${actionName}' args error.`);
            // }
        }
    }


    #validateTableAlias(tableAlias: string): void|never {
        for (let [ tableName, table ] of this.#tableDefs) {
            if (table.alias === tableAlias)
                throw new Error(`Table with alias '${tableAlias}' already exists ('${tableName}').`);
        }
    }

    #validateTableName(tableName: string): void|never {
        if (this.#tableDefs.has(tableName))
            throw new Error(`Table with name '${tableName}' already exists.`);
    }

    #validateTableId(tableId: number): void|never {
        for (let [ tableName, table ] of this.#tableDefs) {
            if (table.getTableId() === tableId)
                throw new Error(`Table with id '${tableId}' already exists ('${tableName}').`);
        }
    }

}
export default DataScheme;