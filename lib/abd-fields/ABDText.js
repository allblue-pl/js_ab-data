import { ts0Assert,                  } from "@allblue/ts0";
import ABDStringValidator, {                              } from "../abd-validators/ABDStringValidator.js";
                                                         
import helper from "../helper.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
import ABDField, {                          } from "./ABDField.js";

export default class ABDText extends ABDField {
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
            return dbType === 'tinytext';
        if (this.type === 'regular')
            return dbType === 'text';
        if (this.type === 'medium')
            return dbType === 'mediumtext';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDBType(dbVersion                 )         {
        if (this.type === 'tiny')
            return 'tinytext';
        if (this.type === 'regular')
            return 'text';
        if (this.type === 'medium')
            return 'mediumtext';

        ts0Assert(false, `Unknown 'text' field type.`);
    }

    __getDefaultValue()              {
        return '';
    }

    __getDBExtra()         {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                         )  
                               {
        if (fieldValidatorArgs.maxLength === undefined)
            fieldValidatorArgs.maxLength = ABDText.TypeSizes[this.#type];

        return new ABDStringValidator(fieldValidatorArgs);
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

;                                                    