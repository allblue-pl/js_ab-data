import { type TS0Preset, type TS0RawValue, type TS0ValueType } from "@allblue/ts0";
declare const types_TNull: unique symbol;
export declare class abDataDefTypes_Class {
    TArray(itemType: ABDataDefValueType): ABDataDefArrayType;
    TArrayPreset(presets: Array<ABDataDefValueType>): ABDataDefArrayPresetType;
    TDefault(defaultValue: TS0RawValue): ABDataDefDefaultType;
    TEnum(values: Array<boolean | number | string | null>): ABDataDefEnumType;
    TJoin(objectPresetInfos: Array<[
        prefix: string,
        type: ABDataDefJoin_SupportedTypes,
        keyNames?: Array<string>
    ]>, extras?: ABDataDefObjectType | null): ABDataDefJoinType;
    TMap(keyType: "int" | "string", valueType: ABDataDefValueType): ABDataDefMapType;
    get TNull(): typeof types_TNull;
    TObject(keyType: "int" | "string", valueType: ABDataDefValueType): ABDataDefObjectType;
    TObjectPreset(presets: ABDataDefPreset, extras?: ABDataDefObjectType | null): ABDataDefObjectPresetType;
    TRequestArgs(requestName: string, actionName: string): ABDataDefRequestArgsType;
    TRequestResult(requestName: string, actionName: string, resultType: "success" | "failure" | "result"): ABDataDefRequestResultType;
    TTableRow(tableName: string, type?: "select" | "update" | "insert"): ABDataDefTableRowType;
    TTableVariantRow(tableVariantName: string): ABDataDefTableVariantRowType;
    TType(typeName: string): ABDataDefTypeType;
    parse(value: ABDataDefValueType): TS0ValueType;
    parsePreset(presets: ABDataDefPreset): TS0Preset;
}
declare const abDataDefTypes: abDataDefTypes_Class;
export default abDataDefTypes;
export declare class ABDataDefArrayType {
    #private;
    get itemType(): ABDataDefValueType;
    constructor(itemType: ABDataDefValueType);
}
export declare class ABDataDefArrayPresetType {
    #private;
    get presets(): Array<ABDataDefValueType>;
    constructor(presets: Array<ABDataDefValueType>);
}
export declare class ABDataDefDefaultType {
    #private;
    get defaultValue(): TS0RawValue;
    constructor(defaultValue: TS0RawValue);
}
export declare class ABDataDefEnumType {
    #private;
    get values(): Array<boolean | number | string | null>;
    constructor(values: Array<boolean | number | string | null>);
}
export declare class ABDataDefJoinType {
    #private;
    get extras(): ABDataDefObjectType | null;
    get joinInfos(): Array<[string, ABDataDefJoin_SupportedTypes, Array<string>?]>;
    constructor(objectPresetInfos: Array<[
        string,
        ABDataDefJoin_SupportedTypes,
        Array<string>?
    ]>, extras?: ABDataDefObjectType | null);
}
type ABDataDefJoin_SupportedTypes = "bool" | "float" | "string" | "long" | "int" | ABDataDefObjectPresetType | ABDataDefTableRowType | ABDataDefTableVariantRowType;
export declare class ABDataDefMapType {
    #private;
    get itemType(): ABDataDefValueType;
    get keyType(): "int" | "string";
    constructor(keyType: "int" | "string", itemType: ABDataDefValueType);
}
export declare class ABDataDefObjectType {
    #private;
    get itemType(): ABDataDefValueType;
    get keyType(): "int" | "string";
    constructor(keyType: "int" | "string", itemType: ABDataDefValueType);
}
export declare class ABDataDefObjectPresetType {
    #private;
    get extras(): ABDataDefObjectType | null;
    get presets(): ABDataDefPreset;
    constructor(presets: ABDataDefPreset, extras?: ABDataDefObjectType | null);
}
export declare class ABDataDefRequestArgsType {
    #private;
    get actionName(): string;
    get requestName(): string;
    constructor(requestName: string, actionName: string);
}
export declare class ABDataDefRequestResultType {
    #private;
    get actionName(): string;
    get requestName(): string;
    get resultType(): "success" | "failure" | "result";
    constructor(requestName: string, actionName: string, resultType?: "success" | "failure" | "result");
}
export declare class ABDataDefTableRowType {
    #private;
    get tableName(): string;
    get type(): "select" | "update" | "insert";
    constructor(tableName: string, type: "select" | "update" | "insert");
}
export declare class ABDataDefTableVariantRowType {
    #private;
    get tableVariantName(): string;
    constructor(tableVariantName: string);
}
export declare class ABDataDefTypeType {
    #private;
    get typeName(): string;
    constructor(typeName: string);
}
export declare class ABDataDefTypeFnType {
    #private;
    get typeFn(): () => ABDataDefValueType;
    constructor(typeFn: () => ABDataDefValueType);
}
export type ABDataDefValueType = null | "bool" | "float" | "string" | "long" | "int" | typeof types_TNull | ABDataDefArrayPresetType | ABDataDefArrayType | ABDataDefDefaultType | ABDataDefEnumType | ABDataDefJoinType | ABDataDefMapType | ABDataDefObjectPresetType | ABDataDefObjectType | ABDataDefRequestArgsType | ABDataDefRequestResultType | ABDataDefTableRowType | ABDataDefTableVariantRowType | ABDataDefTypeType | ABDataDefTypeFnType | Array<ABDataDefValueType>;
export type ABDataDefPreset = {
    [name: string]: ABDataDefValueType;
};
