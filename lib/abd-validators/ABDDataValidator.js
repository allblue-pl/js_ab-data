import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, {                  } from "@allblue/ts0"

import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";
                                             
                                                             
import helper from "../helper.js";
import ABDData from "../abd-fields/ABDData.js";

class ABDDataValidator extends ABDFieldValidator {
             get args()                               {
        return super.args                                ;
    }


    constructor(args                       ) {
        super(args);
    }

    getType()         {
        return 'Data';
    }


    __validate(validator           , fieldName        , value             ) 
                 {
        if (!ts0.assertType(value, ts0.TPreset({
            value: ts0.TRawValue,
                }))) {
            validator.fieldError(fieldName, abText.$(
                    'abData.Errors_WrongDataFieldFormat'));
        }

        let DataDBStr_Length = ABDData.Escape(value).length;
        if (DataDBStr_Length >= ABDData.TypeSizes[this.args.type])
            validator.fieldError(fieldName, "Escaped Data too long.");
    }

}
export default ABDDataValidator;

                                         
                       
  
                                                             
                                  
                                                                           
                                  