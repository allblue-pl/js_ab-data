import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, {                  } from "@allblue/ts0"

import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";
                                             

class ABDIntValidator extends ABDFieldValidator {
             get args()                              {
        return super.args                               ;
    }


    constructor(args                      ) {
        super(args);
    }

    getType()         {
        return 'Int';
    }


    __validate(validator           , fieldName        , value             )  
                 {
        if (value === '') {
            if (this.args.required)
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        }

        if (!this.args.required && value === '')
            return;

        if (isNaN(Number(value)))
            validator.fieldError(fieldName, abText.$('abData.Int_NotANumber'));
        else {
            let number = Number(value);
            if (!Number.isInteger(number))
                validator.fieldError(fieldName, abText.$('abData.Int_NotAnInt'));
            else {
                if (this.args.minValue !== undefined) {
                    if (number < this.args.minValue) {
                        validator.fieldError(fieldName, abText.$(
                                'abData.Int_BelowMin',  { minValue: String(this.args.minValue) }));
                    }
                }

                if (this.args.maxValue !== undefined) {
                    if (number > this.args.maxValue) {
                        validator.fieldError(fieldName, abText.$(
                                'abData.Int_AboveMax', { maxValue: String(this.args.maxValue) }));
                    }
                }
            }
        }
    }

}
export default ABDIntValidator;

                                        
                      
                      
  
                                                           
                                 
                                                                         
                                 