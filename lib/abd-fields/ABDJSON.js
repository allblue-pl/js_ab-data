import ts0, { ts0Assert,                                     } from "@allblue/ts0"
    
import ABDField, {                          } from "./ABDField.js";

import ABDJSONValidator, {                            } from "../abd-validators/ABDJSONValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";

import helper from "../helper.js";
                                                         
                                                                                     
                                                                            

class ABDJSON extends ABDField {
    static Escape(value             )         {
        return `'` + ABDJSON.#Parse(value) + `'`;
    }

    static get TypeSizes()                               {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    static #Parse(value             )         {
        let jsonValue = ts0.assertType               (value,
                presets_ABDJSON_Value).value;

        return helper.escapeString(JSON.stringify({ value: jsonValue, }));
    }


    #type              ;


    get type()               {
        return this.#type;
    }


    constructor(size              , properties                      = {}) {
        super(properties);

        this.#type = size;
    }


    __compareDBType(dbVersion                 , dbType        )          {
        if (this.type === 'tiny')
            return dbType === 'tinytext';
        if (this.type === 'regular')
            return dbType === 'text';
        if (this.type === 'medium')
            return dbType === 'mediumtext';

        ts0Assert(false, `Unknown 'size' field type.`);
    }

    __getDBType(dbVersion                 )         {
         if (this.type === 'tiny')
            return 'tinytext';
        if (this.type === 'regular')
            return 'text';
        if (this.type === 'medium')
            return 'mediumtext';

        ts0Assert(false, `Unknown 'size' field type.`);
    }

    __getDefaultValue()              {
        return null;
    }

    __getDBExtra(dbVersion                 )         {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                       )  
                             {
        if (fieldValidatorArgs.type === undefined)
            fieldValidatorArgs.type = this.#type;

        return new ABDJSONValidator(fieldValidatorArgs                         );
    }

    __getSelectType()                        {
        return SelectColumnType.JSON;
    }

    __getType()         {
        return 'JSON';
    }

    __escape(value             )         {
        return ABDJSON.Escape(value);
    }

    __parse(value             )              {
        return ABDJSON.#Parse(value);
    }

             __unescape(value        )              {
        return value;
    }

}
export default ABDJSON;

                                                     

                             
                       
 
export const presets_ABDJSON_Value = ts0.TRawValue;