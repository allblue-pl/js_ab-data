import { ts0Assert,                  } from "@allblue/ts0";
import ABDField, {                          } from "./ABDField.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
import helper from "../helper.js";
                                                         
import ABDBlobValidator, {                            } from "../abd-validators/ABDBlobValidator.js";

class ABDBlob extends ABDField {
    static get TypeSizes()                               {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    #type              ;


    get type()               {
        return this.#type;
    }   

    constructor(type              , properties                      = {}) {
        super(properties);

        this.#type = type;
    }


    __compareDBType(dbVersion                 , dbType        )                {
        if (this.type === 'tiny')
            return dbType === 'tinyblob';
        if (this.type === 'regular')
            return dbType === 'blob';
        if (this.type === 'medium')
            return dbType === 'mediumblob';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDBExtra()         {
        return '';
    }

    __getDBType(dbVersion                 )               {
        if (this.type === 'tiny')
            return 'tinyblob';
        if (this.type === 'regular')
            return 'blob';
        if (this.type === 'medium')
            return 'mediumblob';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDefaultValue()              {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                       )  
                             {
        if (fieldValidatorArgs.maxLength === undefined)
            fieldValidatorArgs.maxLength = ABDBlob.TypeSizes[this.#type];

        return new ABDBlobValidator(fieldValidatorArgs                         );
    }

    __getSelectType()                        {
        return SelectColumnType.String;
    }

    __getType()         {
        return 'Text';
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
export default ABDBlob;

                                                     