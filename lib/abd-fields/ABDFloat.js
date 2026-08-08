import ts0, {                  } from "@allblue/ts0"
    
import ABDField, {                          } from "./ABDField.js";

import ABDFloatValidator, {                             } from "../abd-validators/ABDFloatValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                         
                                                                                     
                                                                            

class ABDFloat extends ABDField {

    constructor(properties                     ) {
        super(properties);
    }


    __compareDBType(dbVersion                 , dbType        )          {
        return dbType === 'float';
    }

    __getDefaultValue()              {
        return 0.0;
    }

    __getDBExtra(dbVersion                 )         {
        return '';
    }

    __getDBType(dbVersion                 )         {
        return 'float';
    }

    __getFieldValidator(fieldValidatorArgs                        )  
                              {
        return new ABDFloatValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.Float;
    }

    __getType()         {
        return 'Float';
    }

    __escape(value             )         {
        return String(this.__parse(value));
    }

    __parse(value             )              {
        return value;
    }

             __unescape(value        )              {
        return parseFloat(value);
    }

}
export default ABDFloat;