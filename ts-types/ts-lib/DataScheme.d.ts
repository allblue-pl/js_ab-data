import RequestDef from "./RequestDef.ts";
import TableDef, { type TableDef_ValidatorInfo } from "./TableDef.ts";
import type { Request_Parsed } from "./RequestProcessor.ts";
import type Response from "./Response.ts";
declare class DataScheme {
    #private;
    get tableNames(): Array<string>;
    get requestNames(): Array<string>;
    get version(): number;
    constructor(version: number, validation?: boolean);
    defR(requestName: string, requestDef: RequestDef): DataScheme;
    defRequest(requestName: string, requestDef: RequestDef): DataScheme;
    defT(tableDef: TableDef): DataScheme;
    defTable(tableDef: TableDef): DataScheme;
    getIgnored_TableNames(): Array<string>;
    getRequestDef(requestName: string): RequestDef | never;
    getTableDef(tableName: string): TableDef;
    getTableDef_ById(tableId: number): TableDef;
    getTableIds(): {
        [tableName: string]: number;
    };
    getTableValidatorInfos(): {
        [tableName: string]: TableDef_ValidatorInfo;
    };
    hasTable(tableName: string): boolean;
    hasTable_ById(tableId: number): boolean;
    hasRequestDef(requestName: string): boolean;
    ignoreT(tableNames: Array<string>): DataScheme;
    validateRequestResponse(request: Request_Parsed, response: Response): void | never;
    validateRequestArgs(request: Request_Parsed): void | never;
}
export default DataScheme;
