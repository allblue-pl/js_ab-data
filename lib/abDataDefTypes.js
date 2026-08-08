                                                

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

    TEnum(values                              )                    {
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
    #values                              ;

    get values()                               {
        return this.#values;
    }

    constructor(values                              ) {
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