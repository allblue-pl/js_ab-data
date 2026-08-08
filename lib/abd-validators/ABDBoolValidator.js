import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, {                  } from "@allblue/ts0"

import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";
                                             

class ABDBoolValidator extends ABDFieldValidator {
             get args()                               {
        return super.args                                ;
    }


    constructor(args                       ) {
        super(args);
    }

    getType()         {
        return 'Bool';
    }


    __validate(validator           , fieldName        , value             ) 
                 {
        if (!value) {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotChecked'));
        }
    }
}
export default ABDBoolValidator;


                                                           
                                                                         