import { ts0, TS0ObjectType, TS0PresetType, type TS0Preset, type TS0RawValue, type TS0ValueType } from "@allblue/ts0";

const types_TNull = Symbol("abDataDefTypes_TNull");

export class abDataDefTypes_Class {
    TArray(itemType: ABDataDefValueType): ABDataDefArrayType {
        return new ABDataDefArrayType(itemType);
    }

    TArrayPreset(presets: Array<ABDataDefValueType>): ABDataDefArrayPresetType {
        return new ABDataDefArrayPresetType(presets);
    }

    TDefault(defaultValue: TS0RawValue): ABDataDefDefaultType {
        return new ABDataDefDefaultType(defaultValue);
    }

    TEnum(values: Array<boolean|number|string|null>): ABDataDefEnumType {
        return new ABDataDefEnumType(values);
    }

    TJoin(objectPresetInfos: Array<[prefix: string, 
            type: ABDataDefJoin_SupportedTypes, keyNames?: Array<string>]>, 
            extras: ABDataDefObjectType|null = null): ABDataDefJoinType {
        return new ABDataDefJoinType(objectPresetInfos, extras);
    }
    
    TMap(keyType: "int"|"string", valueType: ABDataDefValueType): ABDataDefMapType {
        return new ABDataDefMapType(keyType, valueType);
    }

    get TNull(): typeof types_TNull {
        return types_TNull;
    }

    TObject(keyType: "int"|"string", valueType: ABDataDefValueType): 
            ABDataDefObjectType {
        return new ABDataDefObjectType(keyType, valueType);
    }

    TObjectPreset(presets: ABDataDefPreset, extras: ABDataDefObjectType|null = null): 
            ABDataDefObjectPresetType {
        return new ABDataDefObjectPresetType(presets, extras);
    }

    TRequestArgs(requestName: string, actionName: string): ABDataDefRequestArgsType {
        return new ABDataDefRequestArgsType(requestName, actionName);
    }

    TRequestResult(requestName: string, actionName: string, 
            resultType: "success"|"failure"|"result"): ABDataDefRequestResultType {
        return new ABDataDefRequestResultType(requestName, actionName, resultType);
    }

    TTableRow(tableName: string, type: "select"|"update"|"insert" = "select"): ABDataDefTableRowType {
        return new ABDataDefTableRowType(tableName, type);
    }

    TTableVariantRow(tableVariantName: string): ABDataDefTableVariantRowType {
        return new ABDataDefTableVariantRowType(tableVariantName);
    }

    TType(typeName: string): ABDataDefTypeType {
        return new ABDataDefTypeType(typeName);
    }

    parse(value: ABDataDefValueType): TS0ValueType {
        if (value === null)
            return null;

        if (value === "bool")
            return "boolean";
        if (value === "float")
            return "number";
        if (value === "string")
            return "string";
        if (value === "long")
            return "number";
        if (value === "int")
            return "number";
        if (value === types_TNull)
            return ts0.TNull;
        
        if (value instanceof ABDataDefArrayPresetType)
            return ts0.TPresetArray(this.parse(value.presets) as Array<TS0ValueType>);
        if (value instanceof ABDataDefArrayType)
            return ts0.TArray(this.parse(value.itemType));
        if (value instanceof ABDataDefDefaultType)
            return ts0.TDefault(value.defaultValue);
        if (value instanceof ABDataDefEnumType)
            return ts0.TEnum(value.values);
        if (value instanceof ABDataDefObjectPresetType) {
            return ts0.TPreset(this.parsePreset(value.presets) as TS0Preset, 
                    this.parse(value.extras) as TS0ObjectType | TS0PresetType | null);
        }
        if (value instanceof ABDataDefObjectType)
            return ts0.TObject(this.parse(value.keyType), this.parse(value.itemType));
        if (value instanceof ABDataDefRequestArgsType || 
                value instanceof ABDataDefRequestResultType ||
                value instanceof ABDataDefTableRowType ||
                value instanceof ABDataDefTableVariantRowType)
            return ts0.TRawObject;
        if (value instanceof ABDataDefTypeFnType) {
            return ts0.TValueType(() => {
                return this.parse(value.typeFn());
            })
        }
        if (value instanceof Array) {
            let array_TS0: Array<TS0ValueType> = [];
            for (let type of value)
                array_TS0.push(this.parse(type));

            return array_TS0;
        }

        throw new Error("Cannot parse 'ABDataDefValueType': " + value);
    }

    parsePreset(presets: ABDataDefPreset): TS0Preset {
        let presets_TS0: TS0Preset = {};
        for (let key in presets)
            presets_TS0[key] = this.parse(presets[key]);

        return presets_TS0;
    }
}
const abDataDefTypes = new abDataDefTypes_Class();
export default abDataDefTypes;


export class ABDataDefArrayType {
    #itemType: ABDataDefValueType;

    get itemType(): ABDataDefValueType {
        return this.#itemType;
    }

    constructor(itemType: ABDataDefValueType) {
        this.#itemType = itemType;
    }
}

export class ABDataDefArrayPresetType {
    #presets: Array<ABDataDefValueType>;

    get presets(): Array<ABDataDefValueType> {
        return this.#presets;
    }

    constructor(presets: Array<ABDataDefValueType>) {
        this.#presets = presets;
    }
}

export class ABDataDefDefaultType {
    #defaultValue: TS0RawValue;

    get defaultValue(): TS0RawValue {
        return this.#defaultValue;
    }

    constructor(defaultValue: TS0RawValue) {
        this.#defaultValue = defaultValue;
    }
}

export class ABDataDefEnumType {
    #values: Array<boolean|number|string|null>;

    get values(): Array<boolean|number|string|null> {
        return this.#values;
    }

    constructor(values: Array<boolean|number|string|null>) {
        this.#values = values;
    }
}

export class ABDataDefJoinType {
    #joinInfos: Array<[string, ABDataDefJoin_SupportedTypes, Array<string>?]>;
    #extras: ABDataDefObjectType|null;

    get extras(): ABDataDefObjectType|null {
        return this.#extras;
    }

    get joinInfos(): Array<[string, ABDataDefJoin_SupportedTypes, Array<string>?]> {
        return this.#joinInfos;
    }

    constructor(objectPresetInfos: Array<[string, ABDataDefJoin_SupportedTypes, 
            Array<string>?]>, extras: ABDataDefObjectType|null = null) {
        this.#joinInfos = objectPresetInfos;
        this.#extras = extras;
    }
}
type ABDataDefJoin_SupportedTypes = 
    "bool"|"float"|"string"|"long"|"int"|
    ABDataDefObjectPresetType|
    ABDataDefTableRowType|
    ABDataDefTableVariantRowType;

export class ABDataDefMapType {
    #keyType: "int"|"string";
    #itemType: ABDataDefValueType;

    get itemType(): ABDataDefValueType {
        return this.#itemType;
    }

    get keyType(): "int"|"string" {
        return this.#keyType;
    }

    constructor(keyType: "int"|"string", itemType: ABDataDefValueType) {
        this.#keyType = keyType;
        this.#itemType = itemType;
    }
}

export class ABDataDefObjectType {
    #keyType: "int"|"string";
    #itemType: ABDataDefValueType;

    get itemType():ABDataDefValueType {
        return this.#itemType;
    }

    get keyType(): "int"|"string" {
        return this.#keyType;
    }

    constructor(keyType: "int"|"string", itemType: ABDataDefValueType) {
        this.#keyType = keyType;
        this.#itemType = itemType;
    }
}

export class ABDataDefObjectPresetType {
    #presets: ABDataDefPreset;
    #extras: ABDataDefObjectType|null;

    get extras(): ABDataDefObjectType|null {
        return this.#extras;
    }

    get presets(): ABDataDefPreset {
        return this.#presets;
    }

    constructor(presets: ABDataDefPreset, extras: ABDataDefObjectType|null = null) {
        this.#presets = presets;
        this.#extras = extras;
    }
}

export class ABDataDefRequestArgsType {
    #actionName: string;
    #requestName: string;

    get actionName(): string {
        return this.#actionName;
    }

    get requestName(): string {
        return this.#requestName;
    }

    constructor(requestName: string, actionName: string) {
        this.#requestName = requestName;
        this.#actionName = actionName;
    }
}

export class ABDataDefRequestResultType {
    #actionName: string;
    #requestName: string;
    #resultType: "success"|"failure"|"result";

    get actionName(): string {
        return this.#actionName;
    }

    get requestName(): string {
        return this.#requestName;
    }

    get resultType(): "success"|"failure"|"result" {
        return this.#resultType;
    }

    constructor(requestName: string, actionName: string, 
            resultType: "success"|"failure"|"result" = "result") {
        this.#requestName = requestName;
        this.#actionName = actionName;
        this.#resultType = resultType;
    }
}

export class ABDataDefTableRowType {
    #tableName: string;
    #type: "select"|"update"|"insert";

    get tableName(): string {
        return this.#tableName;
    }

    get type(): "select"|"update"|"insert" {
        return this.#type;
    }

    constructor(tableName: string, type: "select"|"update"|"insert") {
        this.#tableName = tableName;
        this.#type = type;
    }
}

export class ABDataDefTableVariantRowType {
    #tableVariantName: string;

    get tableVariantName(): string {
        return this.#tableVariantName;
    }

    constructor(tableVariantName: string) {
        this.#tableVariantName = tableVariantName;
    }
}

export class ABDataDefTypeType {
    #typeName: string;

    get typeName(): string {
        return this.#typeName;
    }

    constructor(typeName: string) {
        this.#typeName = typeName;
    }
}

export class ABDataDefTypeFnType {
    #typeFn: () => ABDataDefValueType;

    get typeFn(): () => ABDataDefValueType {
        return this.#typeFn;
    }

    constructor(typeFn: () => ABDataDefValueType) {
        this.#typeFn = typeFn
    }
}

export type ABDataDefValueType = null|
        "bool"|"float"|"string"|"long"|"int"|
        typeof types_TNull|
        ABDataDefArrayPresetType|ABDataDefArrayType|ABDataDefDefaultType|
        ABDataDefEnumType|ABDataDefJoinType|ABDataDefMapType|ABDataDefObjectPresetType|
        ABDataDefObjectType|ABDataDefRequestArgsType|ABDataDefRequestResultType|
        ABDataDefTableRowType|ABDataDefTableVariantRowType|ABDataDefTypeType|ABDataDefTypeFnType|
        Array<ABDataDefValueType>;
export type ABDataDefPreset = {[name:string]: ABDataDefValueType};