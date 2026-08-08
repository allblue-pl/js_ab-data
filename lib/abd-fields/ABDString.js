import ts0, {                  } from "@allblue/ts0"
    
import ABDField, {                          } from "./ABDField.js";

import ABDStringValidator, {                              } from "../abd-validators/ABDStringValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";

import helper from "../helper.js";
                                                         

class ABDString extends ABDField {
    #size        ;


    get size()         {
        return this.#size;
    }


    constructor(size        , properties                      = {}) {
        super(properties);

        this.#size = size;
    }


    __compareDBType(dbVersion                 , dbType        )          {
        return dbType === `varchar(${this.size})`;
    }

    __getDBType(dbVersion                 )         {
        return `varchar(${this.size})`;
    }

    __getDefaultValue()              {
        return '';
    }

    __getDBExtra(dbVersion                 )         {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                         )  
                               {
        if (fieldValidatorArgs.maxLength === undefined)
            fieldValidatorArgs.maxLength = this.size;

        return new ABDStringValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.String;
    }

    __getType()         {
        return 'String';
    }

    __escape(value             )         {
        return `'` + this.__parse(value) + `'`;
    }

    __parse(value             )              {
        return helper.escapeString(String(value));
    }

             __unescape(value        )              {
        return value;
    }
}
export default ABDString;
