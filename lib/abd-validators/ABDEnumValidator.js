import abEnums from "ab-strings";
import abText from "ab-text";
import ts0, {                  } from "@allblue/ts0"

import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";
                                             

class ABDEnumValidator extends ABDFieldValidator {
             get args()                               {
        return super.args                                ;
    }


    constructor(args                       ) {
        if (args.values === undefined)
            args.values = [];

        super(args);
    }

    getType()         {
        return 'Enum';
    }


    __validate(validator           , fieldName        , value             ) 
                 {
        value = String(value);

        if (value === '') {
            if (this.args.required)
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        } else {
            if (this.args.values !== undefined) {
                if (!this.args.values.includes) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.Errors_NotInValues', 
                            [ this.args.values.join(", ") ] ));
                }
            }
        }
    }
}
export default ABDEnumValidator;

                                         
                           
  
                                                            
                                  
                                                                          
                                  