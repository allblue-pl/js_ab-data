import ts0, {                  } from "@allblue/ts0"
    
import ABDField, {                          } from "./ABDField.js";

import ABDTimeValidator, {                            } from "../abd-validators/ABDTimeValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                         
                                                                                     
                                                                            

class ABDTime extends ABDField {
    constructor(properties                      = {}) {
        super(properties);
    }


    __compareDBType(dbVersion                 , dbType        )          {
        return [ 'bigint', 'bigint(20)' ].includes(dbType);
    }

    __getDBType(dbVersion                 )         {
        return 'bigint';
    }

    __getDefaultValue()              {
        return 0;
    }

    __getDBExtra()         {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                       )  
                             {
        return new ABDTimeValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.Long;
    }

    __getType()         {
        return 'Time';
    }

    __escape(value             )         {
        return String(this.__parse(value));
    }

    __parse(value             )              {
        return value;
    }

             __unescape(value        )              {
        return Number(value);
    }

}
export default ABDTime;
