import { ts0, TS0ObjectType, TS0PresetType,                                                     } from "@allblue/ts0";

const types_TNull = Symbol("abDataDefTypes_TNull");

export class abDataDefTypes_Class {
    TArray(itemType                    )                     {
        return new ABDataDefArrayType(itemType);
    }

    TArrayPreset(presets                           )                           {
        return new ABDataDefArrayPresetType(presets);
    }

    TDefault(defaultValue             )                       {
        return new ABDataDefDefaultType(defaultValue);
    }

    TEnum(values                                   )                    {
        return new ABDataDefEnumType(values);
    }
    
    get TNull()                     {
        return types_TNull;
    }

    TObject(keyType                    , valueType                    )  
                                {
        return new ABDataDefObjectType(keyType, valueType);
    }

    TObjectPreset(presets                 , extras                           = null)  
                                      {
        return new ABDataDefObjectPresetType(presets, extras);
    }

    TRequestArgs(requestName        , actionName        )                           {
        return new ABDataDefRequestArgsType(requestName, actionName);
    }

    TRequestResult(requestName        , actionName        )                             {
        return new ABDataDefRequestResultType(requestName, actionName);
    }

    TTableRow(tableName        )                        {
        return new ABDataDefTableRowType(tableName);
    }

    parse(value                    )               {
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
            return ts0.TPresetArray(this.parse(value.presets)                       );
        if (value instanceof ABDataDefArrayType)
            return ts0.TArray(this.parse(value.itemType));
        if (value instanceof ABDataDefDefaultType)
            return ts0.TDefault(value.defaultValue);
        if (value instanceof ABDataDefEnumType)
            return ts0.TEnum(value.values);
        if (value instanceof ABDataDefObjectPresetType) {
            return ts0.TPreset(this.parsePreset(value.presets)             , 
                    this.parse(value.extras)                                        );
        }
        if (value instanceof ABDataDefObjectType)
            return ts0.TObject(this.parse(value.keyType), this.parse(value.itemType));
        if (value instanceof ABDataDefRequestArgsType || 
                value instanceof ABDataDefRequestResultType ||
                value instanceof ABDataDefTableRowType)
            return ts0.TRawObject;
        if (value instanceof ABDataDefTypeFnType) {
            return ts0.TValueType(() => {
                return this.parse(value.typeFn());
            })
        }
        if (value instanceof Array) {
            let array_TS0                      = [];
            for (let type of value)
                array_TS0.push(this.parse(type));

            return array_TS0;
        }

        throw new Error("Cannot parse 'ABDataDefValueType': " + value);
    }

    parsePreset(presets                 )            {
        let presets_TS0            = {};
        for (let key in presets)
            presets_TS0[key] = this.parse(presets[key]);

        return presets_TS0;
    }
}
const abDataDefTypes = new abDataDefTypes_Class();
export default abDataDefTypes;


export class ABDataDefArrayType {
    #itemType                    ;

    get itemType()                     {
        return this.#itemType;
    }

    constructor(itemType                    ) {
        this.#itemType = itemType;
    }
}

export class ABDataDefArrayPresetType {
    #presets                           ;

    get presets()                            {
        return this.#presets;
    }

    constructor(presets                           ) {
        this.#presets = presets;
    }
}

export class ABDataDefDefaultType {
    #defaultValue             ;

    get defaultValue()              {
        return this.#defaultValue;
    }

    constructor(defaultValue             ) {
        this.#defaultValue = defaultValue;
    }
}

export class ABDataDefEnumType {
    #values                                   ;

    get values()                                    {
        return this.#values;
    }

    constructor(values                                   ) {
        this.#values = values;
    }
}

export class ABDataDefObjectType {
    #keyType                    ;
    #itemType                    ;

    get itemType()                     {
        return this.#itemType;
    }

    get keyType()                     {
        return this.#keyType;
    }

    constructor(keyType                    , itemType                    ) {
        this.#keyType = keyType;
        this.#itemType = itemType;
    }
}

export class ABDataDefObjectPresetType {
    #presets                 ;
    #extras                          ;

    get extras()                           {
        return this.#extras;
    }

    get presets()                  {
        return this.#presets;
    }

    constructor(presets                 , extras                           = null) {
        this.#presets = presets;
        this.#extras = extras;
    }
}

export class ABDataDefRequestArgsType {
    #actionName        ;
    #requestName        ;

    get actionName()         {
        return this.#actionName;
    }

    get requestName()         {
        return this.#requestName;
    }

    constructor(requestName        , actionName        ) {
        this.#requestName = requestName;
        this.#actionName = actionName;
    }
}

export class ABDataDefRequestResultType {
    #actionName        ;
    #requestName        ;

    get actionName()         {
        return this.#actionName;
    }

    get requestName()         {
        return this.#requestName;
    }

    constructor(requestName        , actionName        ) {
        this.#requestName = requestName;
        this.#actionName = actionName;
    }
}

export class ABDataDefTableRowType {
    #tableName        ;

    get tableName()         {
        return this.#tableName;
    }

    constructor(tableName        ) {
        this.#tableName = tableName;
    }
}

export class ABDataDefTypeFnType {
    #typeFn                          ;

    get typeFn()                           {
        return this.#typeFn;
    }

    constructor(typeFn                          ) {
        this.#typeFn = typeFn
    }
}

;                                     
                                             
                           
                                                                         
                                                                        
                                                            
                                                  
                                  
;                                                                 