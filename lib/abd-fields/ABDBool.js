import ts0, {                  } from "@allblue/ts0"
    
import ABDField, {                          } from "./ABDField.js";

import ABDBoolValidator, {                            } from "../abd-validators/ABDBoolValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                         
                                                                                     
                                                                            


class ABDBool extends ABDField {
    constructor(properties                      = {}) {
        super(properties);
    }


    __compareDBType(dbVersion                 , dbType        )          {
        return dbType === 'tinyint(1)' || dbType === 'bool';
    }

    __getDBType(dbVersion                 )         {
        return 'tinyint(1)';
    }

    __getDefaultValue()              {
        return false;
    }

     __getDBExtra(dbVersion                 )         {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                       )  
                             {
        return new ABDBoolValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.Bool;
    }

    __getType()         {
        return 'Bool';
    }

    __escape(value             )         {
        if (this.__parse(value))
            return '1';

        return '0';
    }

    __parse(value             )              {
        if (value)
            return true;

        return false;
    }

             __unescape(value        )              {
        return value ? true : false;
    }

}
export default ABDBool;
