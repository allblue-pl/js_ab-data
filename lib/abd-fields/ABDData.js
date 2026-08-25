import ts0, { ts0Assert,                                     } from "@allblue/ts0"
    
import ABDField, {                          } from "./ABDField.js";

import ABDDataValidator, {                            } from "../abd-validators/ABDDataValidator.js";
import SelectColumnType, {                            } from "../SelectColumnType.js";

import helper from "../helper.js";
                                                         
                                                                                     
                                                                            
                                                               

class ABDData extends ABDField {
    static Escape(value             )         {
        return `'` + ABDData.#Parse(value) + `'`;
    }

    static get TypeSizes()                               {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }


    static #Parse(value             )         {
        let DataValue = ts0.assertType               (value,
                presets_ABDData_Value).value;

        return helper.escapeString(JSON.stringify({ value: DataValue, }));
    }


    #dataDef                    ;
    #type              ;


    get dataDef()                     {
        return this.#dataDef;
    }

    get type()               {
        return this.#type;
    }


    constructor(dataDef                    , size              , properties                      = {}) {
        super(properties);

        this.#dataDef = dataDef;
        this.#type = size;
    }


    __compareDBType(dbVersion                 , dbType        )          {
        if (this.type === 'tiny')
            return dbType === 'tinytext';
        if (this.type === 'regular')
            return dbType === 'text';
        if (this.type === 'medium')
            return dbType === 'mediumtext';

        ts0Assert(false, `Unknown 'size' field type.`);
    }

    __getDBType(dbVersion                 )         {
         if (this.type === 'tiny')
            return 'tinytext';
        if (this.type === 'regular')
            return 'text';
        if (this.type === 'medium')
            return 'mediumtext';

        ts0Assert(false, `Unknown 'size' field type.`);
    }

    __getDefaultValue()              {
        return null;
    }

    __getDBExtra(dbVersion                 )         {
        return '';
    }

    __getFieldValidator(fieldValidatorArgs                       )  
                             {
        if (fieldValidatorArgs.type === undefined)
            fieldValidatorArgs.type = this.#type;

        return new ABDDataValidator(fieldValidatorArgs                         );
    }

    __getSelectType()                        {
        return SelectColumnType.JSON;
    }

    __getType()         {
        return 'Data';
    }

    __escape(value             )         {
        return ABDData.Escape(value);
    }

    __parse(value             )              {
        return ABDData.#Parse(value);
    }

             __unescape(value                       )                        {
        return value;
    }

}
export default ABDData;

                                                     

                             
                       
 
export const presets_ABDData_Value = ts0.TRawValue;