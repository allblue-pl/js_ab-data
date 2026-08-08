import type { TS0RawValue } from "@allblue/ts0";
declare const types_TNull: unique symbol;
export declare class abDataDefTypes_Class {
    TArray(itemType: ABDataDefValueType): ABDataDefArrayType;
    TArrayPreset(presets: Array<ABDataDefValueType>): ABDataDefArrayPresetType;
    TDefault(defaultValue: TS0RawValue): ABDataDefDefaultType;
    TEnum(values: Array<boolean | number | string>): ABDataDefEnumType;
    get TNull(): typeof types_TNull;
    TObject(keyType: ABDataDefValueType, valueType: ABDataDefValueType): ABDataDefObjectType;
    TObjectPreset(presets: ABDataDefPreset, extras?: ABDataDefObjectType | null): ABDataDefObjectPresetType;
    TRequestArgs(requestName: string, actionName: string): ABDataDefRequestArgsType;
    TRequestResult(requestName: string, actionName: string): ABDataDefRequestResultType;
    TTableRow(tableName: string): ABDataDefTableRowType;
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
    get values(): Array<boolean | number | string>;
    constructor(values: Array<boolean | number | string>);
}
export declare class ABDataDefObjectType {
    #private;
    get itemType(): ABDataDefValueType;
    get keyType(): ABDataDefValueType;
    constructor(keyType: ABDataDefValueType, itemType: ABDataDefValueType);
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
    constructor(requestName: string, actionName: string);
}
export declare class ABDataDefTableRowType {
    #private;
    get tableName(): string;
    constructor(tableName: string);
}
export declare class ABDataDefTypeFnType {
    #private;
    get typeFn(): () => ABDataDefValueType;
    constructor(typeFn: () => ABDataDefValueType);
}
export type ABDataDefValueType = null | "bool" | "float" | "string" | "long" | "int" | typeof types_TNull | ABDataDefArrayPresetType | ABDataDefArrayType | ABDataDefDefaultType | ABDataDefEnumType | ABDataDefObjectPresetType | ABDataDefObjectType | ABDataDefRequestArgsType | ABDataDefRequestResultType | ABDataDefTableRowType | ABDataDefTypeFnType | Array<ABDataDefValueType>;
export type ABDataDefPreset = {
    [name: string]: ABDataDefValueType;
};
