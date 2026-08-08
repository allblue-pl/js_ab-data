import {                  } from "@allblue/ts0";
import abText from "ab-text";
                                             
import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";

class ABDBlobValidator extends ABDFieldValidator {
             get args()                               {
        return super.args                                ;
    }


    constructor(args                       ) {
        super(args);
    }

    getType()         {
        return 'Blob';
    }


    __validate(validator           , fieldName        , value             ) 
                 {
        if (String(value).length === 0) {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        }

        if (String(value).length >= this.args.maxLength)
            validator.fieldError(fieldName, "Blob too big.");
    }
}
export default ABDBlobValidator;

                                         
                      
  
                                                             
                                  
                                                                           
                                 