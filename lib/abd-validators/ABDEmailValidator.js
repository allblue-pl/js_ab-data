import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, {                  } from "@allblue/ts0"

import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";
                                             

class ABDEmailValidator extends ABDFieldValidator {
             get args()                                {
        return super.args                                 ;
    }


    constructor(args                        ) {
        super(args);
    }

    getType()         {
        return 'Email';
    }


    __validate(validator           , fieldName        , value             ) 
                 {
        if (value === '') {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        } 

        let re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!re.test(String(value).toLowerCase()))
            validator.fieldError(fieldName, abText.$('abData.NotSet'));
    }

}
export default ABDEmailValidator;

                                                            
                                                                          