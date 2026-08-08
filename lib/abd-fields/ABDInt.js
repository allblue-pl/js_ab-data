import ts0, { ts0Helper,                  } from "@allblue/ts0"

import ABDField, {                           } from "./ABDField.js";

import ABDIntValidator, {                           } from "../abd-validators/ABDIntValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                         

class ABDInt extends ABDField {
    #unsigned         ;

    get unsigned()          {
        return this.#unsigned;
    }

    constructor(properties                    = {}, unsigned          = false) {
        super(properties);

        this.#unsigned = properties.unsigned === undefined ?
                false : properties.unsigned;
    }


    __getDBExtra(dbVersion                 )         {
        return '';
    }

    __getDBType(dbVersion                 )         {
        if (dbVersion.type === 'mysql')
            return 'int' + (this.unsigned ? ' unsigned' : '');

        return 'int';
    }

    __compareDBType(dbVersion                 , dbType        )  
                    {
        let unsigned = this.unsigned ? ' unsigned' : '';
        return [ `int${unsigned}`, `int(11)${unsigned}` ].includes(dbType);
    }

    __getDefaultValue()              {
        return 0;
    }

    __getFieldValidator(fieldValidatorArgs                      )  
                            {
        return new ABDIntValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.Int;
    }

    __getType()         {
        return 'Int';
    }

    __escape(value             )         {
        return String(this.__parse(value));
    }

    __parse(value             )              {
        return Math.floor(Number(value));
    }

             __unescape(value             )         {
        return parseInt(String(value));
    }

}
export default ABDInt;

                                                       
                      
  