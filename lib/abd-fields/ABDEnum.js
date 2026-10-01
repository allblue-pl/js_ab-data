import {                  } from "@allblue/ts0";
                                                         
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                                                   
import ABDEnumValidator from "../abd-validators/ABDEnumValidator.js";
import helper from "../helper.js";
import ABDField, {                               } from "./ABDField.js";

class ABDEnum extends ABDField {
    #values               ;


    get size()         {
        let size = 0;
        for (let value of this.values) {
            if (value.length > size)
                size = value.length;
        }
        return size;
    }

    get values()                {
        return this.#values;
    }


    constructor(values               , properties                           = {}) {
        super(properties);

        this.#values = values;
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

    __getFieldValidator(fieldValidatorArgs                       )  
                             {
        if (fieldValidatorArgs.values === undefined)
            fieldValidatorArgs.values = this.values;

        return new ABDEnumValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.String;
    }

    __getType()         {
        return 'Enum';
    }

    __escape(value             )         {
        return `'` + this.__parse(value) + `'`;
    }

    __parse(value             )              {
        return helper.escapeString(String(value));
    }

             __unescape(value                       )                        {
        return value;
    }
}
export default ABDEnum;
