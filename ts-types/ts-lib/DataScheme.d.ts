import RequestDef from "./RequestDef.ts";
import TableDef, { type TableDef_ValidatorInfo } from "./TableDef.ts";
import type { Request_Parsed } from "./RequestProcessor.ts";
import type Response from "./Response.ts";
import { ABDataDefObjectPresetType, type ABDataDefPreset, type ABDataDefValueType } from "./abDataDefTypes.ts";
import type TableDefVariant from "./TableDefVariant.ts";
import type ABDColumnRef from "./abd-fields/ABDColumnRef.ts";
import ABDField from "./abd-fields/ABDField.ts";
declare class DataScheme {
    #private;
    get layoutNames(): Array<string>;
    get tableNames(): Array<string>;
    get tableVariantNames(): Array<string>;
    get typeNames(): Array<string>;
    get requestNames(): Array<string>;
    get version(): number;
    constructor(version: number, validation?: boolean);
    defL(layoutName: string, defPreset: ABDataDefPreset): DataScheme;
    defLayout(layoutName: string, defPreset: ABDataDefPreset): DataScheme;
    defR(requestName: string, requestDef: RequestDef): DataScheme;
    defRequest(requestName: string, requestDef: RequestDef): DataScheme;
    defTable(tableDef: TableDef): DataScheme;
    defTableVariant(tableDefVariant: TableDefVariant): DataScheme;
    defType(typeName: string, typeDef: ABDataDefValueType, requestArg?: boolean): DataScheme;
    defTypes(prefix: string, typeDefs: {
        [key: string]: ABDataDefValueType;
    }): DataScheme;
    getIgnored_TableNames(): Array<string>;
    getLayoutDef(layoutName: string): ABDataDefObjectPresetType;
    getRequestDef(requestName: string): RequestDef | never;
    getTableDef(tableName: string): TableDef;
    getTableDef_ById(tableId: number): TableDef;
    getTableDefVariant(tableName: string): TableDefVariant;
    getTableIds(): {
        [tableName: string]: number;
    };
    getTableValidatorInfos(): {
        [tableName: string]: TableDef_ValidatorInfo;
    };
    getTypeInfo(typeName: string): {
        def: ABDataDefValueType;
        requestArg: boolean;
    };
    hasTable(tableName: string): boolean;
    hasTable_ById(tableId: number): boolean;
    hasRequestDef(requestName: string): boolean;
    ignoreT(tableNames: Array<string>): DataScheme;
    parseField(field: ABDField | ABDColumnRef): ABDField;
    validateRequestResponse(request: Request_Parsed, response: Response): void | never;
    validateRequestArgs(request: Request_Parsed): void | never;
}
export default DataScheme;
