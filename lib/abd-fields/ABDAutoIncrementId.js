import ts0, {                  } from "@allblue/ts0"

import ABDField from "./ABDField.js";

import ABDIntValidator from "../abd-validators/ABDIntValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";
                                                         
                                                                                     
                                                                            

class ABDAutoIncrementId extends ABDField {
    constructor() {
        super({ notNull: true, });
    }


    __compareDBType(dbVersion                 , dbType        , 
            dbExtra        )          {
         if (dbVersion.type === 'sqlite')
            return dbType === 'integer';

        if (dbExtra !== 'auto_increment')
            return false;

        return dbType === 'int';        
    }

    __getDBType(dbVersion                 )         {
        if (dbVersion.type === 'sqlite')
            return 'integer';

        return 'int';
    }

    __getDefaultValue()              {
        return 0;
    }

    __getDBExtra(dbVersion                 )         {
        if (dbVersion.type === 'sqlite')
            return '';

        return 'auto_increment';
    }

    __getFieldValidator(fieldValidatorArgs                        )  
                              {
        return new ABDIntValidator(fieldValidatorArgs);
    }

    __getSelectType()                        {
        return SelectColumnType.Int;
    }

    __getType()         {
        return 'AutoIncrementId';
    }

    __escape(value             )         {
        return String(Math.round(Number(value)));
    }

    __parse(value             )              {
        return Math.round(Number(value));
    }

             __unescape(value        )              {
        return parseInt(value);
    }
}
export default ABDAutoIncrementId;
