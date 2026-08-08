import ts0, {                  } from "@allblue/ts0"
    
import ABDField, {                          } from "./ABDField.js";

import ABDStringValidator, {                              } from "../abd-validators/ABDStringValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";

import helper from "../helper.js";
                                                         
                                                                                     
                                                                            
                                                                                   
                                                                          

class ABDDate extends ABDField {
    constructor(properties                      = {}) {
        super(properties);
    }


    __compareDBType(dbVersion                 , dbType        )          {
        return dbType === 'datetime';
    }

    __getDBType(dbVersion                 )         {
        return 'datetime'
    }

    __getDefaultValue()              {
        return '0000-00-00'; // length: 10
    }

    __getDBExtra()         {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                         )  
                               {
        fieldValidatorArgs.maxLength = 10;

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
export default ABDDate;