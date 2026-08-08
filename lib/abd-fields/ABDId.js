import {                  } from "@allblue/ts0"
import ABDField from "./ABDField.js";
import ABDLongValidator from "../abd-validators/ABDLongValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                         
                                                                                     
                                                                            

class ABDId extends ABDField {
    constructor() {
        super({ notNull: true });
    }


    __compareDBType(dbVersion                 , dbType        )  
                    {
        return [ 'bigint', 'bigint(20)' ].includes(dbType);
    }

    __getDBExtra()         {
        return '';
    }

    __getDBType(dbVersion                 )         {
        return 'bigint';
    }

    __getDefaultValue()              {
        return 0;
    }

    __getFieldValidator(fieldValidatorArgs                        )                    {
        return new ABDLongValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.Long;
    }

    __getType()         {
        return 'Id';
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
export default ABDId;
