import {                  } from "@allblue/ts0";
    
import ABDField, {                          } from "./ABDField.js";

import ABDLongValidator, {                            } from "../abd-validators/ABDLongValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                         
                                                                                     
                                                                            

class ABDLong extends ABDField {

    constructor(properties                      = {}) {
        super(properties);
    }


    __compareDBType(dbVersion                 , dbType        )          {
        return dbType === 'bigint';
    }

    __getDBExtra(dbVersion                 )         {
        return '';
    }

    __getDBType(dbVersion                 )         {
        return 'bigint';
    }

    __getDefaultValue()              {
        return 0;
    }


    __getFieldValidator(fieldValidatorArgs                       ) 
                             {
        return new ABDLongValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.Long;
    }

    __getType()         {
        return 'Long';
    }

    __escape(value             )         {
        return String(value);
    }

    __parse(value             )              {
        return value;
    }

             __unescape(value        )              {
        return Number(value);
    }

}
export default ABDLong;

                                                     