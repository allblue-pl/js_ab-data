import ts0, {                  } from "@allblue/ts0"
import ABDFieldValidator from "./abd-validators/ABDFieldValidator.js";
                                                     
                                            

export default class Validator {
    #info               ;

    constructor() {
        this.#info =  {
            valid: true,
            fields: {},
            state: '',
            errors: [],
        };
    }

    addField(fieldName        , fieldValue             )       {
        this.#fields_Add(fieldName, fieldValue);
    }

    addFieldValidator(fieldName        , fieldValidator                   )       {
        if (!this.hasField(fieldName))
            throw new Error(`Field '${fieldName}' does not exist.`);

        fieldValidator.validate(this, fieldName, this.#info.fields[fieldName].value);
    }

    getFieldInfo(fieldName        )                     {
        if (!(fieldName in this.#info['fields']))
            throw new Error(`Field '${fieldName}' does not exist.`);

        return this.#info.fields[fieldName];
    }

    getInfo()                {
        return this.#info;
    }

    error(message        )       {
        this.#info.valid = false;
        this.#info.errors.push(message);
    }

    fieldError(fieldName        , message        )       {
        let field = this.#fields_Get(fieldName);

        this.#info.valid = false;
        this.#info.state = 'error';

        field.valid = false;
        field.errors.push(message);
    }

    hasField(fieldName        )          {
        return fieldName in this.#info['fields'];
    }

    isFieldValid(fieldName        )          {
        return this.getFieldInfo(fieldName).valid;
    }

    isValid()          {
        return this.#info.valid;
    }


    #fields_Add(fieldName        , fieldValue             )                     {
        this.#info.fields[fieldName] = {
            valid: true,
            value: fieldValue,
            state: '',
            errors: [],
            warnings: [],
            successes: [],
        };

        return this.#info.fields[fieldName];
    }

    #fields_Get(fieldName        )                     {
        if (!this.hasField(fieldName))
            throw new Error(`Field '${fieldName}' does not exist.`);

        return this.#info.fields[fieldName];
    }

    // _fields_Exists(fieldName)
    // {
    //     return fieldName in this.#info['fields'];
    // }
}

;                            
                   
                                                      
                  
                          
  

;                                 
                   
                       
              
                          
                            
                             
 