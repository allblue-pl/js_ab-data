import ts0, { ts0Helper, ts0Virtual,                                  } from "@allblue/ts0"
import SelectColumnType, {                            } from "../SelectColumnType.js";
import DatabaseVersion, {                   } from "../DatabaseVersion.js";
import ABDFieldValidator, {                             } from "../abd-validators/ABDFieldValidator.js";

         class ABDField {
    #notNull         ;
    #defaultValue                       ;

    get defaultValue()              {
        return this.#defaultValue === undefined ? 
                (this.notNull ? this.__getDefaultValue() : null) :
                this.#defaultValue;
    }

    get notNull()          {
        return this.#notNull;
    }


    constructor(properties                      = {}) {
        this.#notNull = properties.notNull === undefined ? 
                false : properties.notNull;
        this.#defaultValue = properties.defaultValue;
    }

    compareDBType(dbVersion                 , dbType        , 
            dbExtra        )          {
        return this.__compareDBType(dbVersion, dbType, dbExtra);
    }

    getDBType(dbVersion                 )         {
        return this.__getDBType(dbVersion);
    }

    getDBExtra(dbVersion                 )         {
        return this.__getDBExtra(dbVersion);
    }

    getSelectType()                        {
        return this.__getSelectType();
    }

    getType()         {
        return this.__getType();
    }

    getQuery_Column(dbVersion                 , columnName        )         {
        let dbExtra = this.getDBExtra(dbVersion);
        return `\`${columnName}\` ` + this.getDBType(dbVersion) + (this.notNull ? 
                ' NOT NULL' : ' NULL') + (dbExtra === '' ? '' : ` ${dbExtra}`);
    }

    escape(value             )         {
        if (value === null)
            return 'NULL';

        return ts0.rtn('string', this.__escape(value));
    }

    escapeArray(arr                    )         {
        let arr_Escaped = [];
        for (let val of arr)
            arr_Escaped.push(this.escape(val));

        return '(' + arr_Escaped.join(',') + ')';
    }

    getFieldValidator(fieldValidatorArgs                        )                    {
        if (!('notNull' in fieldValidatorArgs))
            fieldValidatorArgs.notNull = this.notNull;

        return this.__getFieldValidator(fieldValidatorArgs);
    }

    parse(value             )              {
        if (value === null)
            return null;

        return this.__parse(value);
    }

    unescape(value        )              {
        if (value === null)
            return null;

        return this.__unescape(value);
    }


    __unescape(value        )              { 
        return value;
    }


                                                                         
                                      
                                                              
                                                             
                                              
                                                                                                
                                                      
                                 
                                                  
                                                      
}
export default ABDField;

                                   
                      
                               
                                     