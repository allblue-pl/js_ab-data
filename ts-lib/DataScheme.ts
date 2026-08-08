import ts0, { type TS0ValueType } from "@allblue/ts0"
import RequestDef from "./RequestDef.ts";
import TableDef, { type TableDef_ValidatorInfo } from "./TableDef.ts";
import type { Request_Parsed } from "./RequestProcessor.ts";
import type { ResponseData, ResponseDataResults } from "./Response.ts";
import type { ResponseResultData } from "./ResponseResult.ts";
import type { ValidatorInfo } from "./Validator.ts";
import type Response from "./Response.ts";

class DataScheme {
    #ignored_TableNames: Array<string>;
    #requestDefs: Map<string, RequestDef>;
    #tableDefs: Map<string, TableDef>;
    #version: number;
    #validation: boolean;


    get tableNames(): Array<string> {
        return this.#tableDefs.keys().toArray();
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

        this.#requestDefs = new Map<string, RequestDef>();
        this.#tableDefs = new Map<string, TableDef>();

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

    defT(tableDef: TableDef): DataScheme {
        if (tableDef.pks === null)
            throw new Error(`Table '${tableDef.name}' PKs not set.`);

        this.defTable(tableDef);

        return this;
    }

    defTable(tableDef: TableDef): DataScheme {
        this.#validateTableId(tableDef.getTableId());

        if (this.#tableDefs.has(tableDef.name))
            throw new Error(`Table '${tableDef.name}' already exists.`);

        this.#tableDefs.set(tableDef.name, tableDef);

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

    validateRequestArgs(request: Request_Parsed): void|never {
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


    #validateTableId(tableId: number): void {
        for (let [ tableName, table ] of this.#tableDefs) {
            if (table.getTableId() === tableId)
                throw new Error(`Table with id '${tableId}' already exists ('${tableName}')`);
        }
    }

}
export default DataScheme;