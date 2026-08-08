import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, {                  } from "@allblue/ts0"

import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";
                                             
                                                             
import helper from "../helper.js";
import ABDJSON from "../abd-fields/ABDJSON.js";

class ABDJSONValidator extends ABDFieldValidator {
             get args()                               {
        return super.args                                ;
    }


    constructor(args                       ) {
        super(args);
    }

    getType()         {
        return 'JSON';
    }


    __validate(validator           , fieldName        , value             ) 
                 {
        if (!ts0.assertType(value, ts0.TPreset({
            value: ts0.TRawObject,
                }))) {
            validator.fieldError(fieldName, abText.$(
                    'abData.Errors_WrongJSONFieldFormat'));
        }

        let jsonDBStr_Length = ABDJSON.Escape(value).length;
        if (jsonDBStr_Length >= ABDJSON.TypeSizes[this.args.type])
            validator.fieldError(fieldName, "Escaped json too long.");
    }

}
export default ABDJSONValidator;

                                         
                       
  
                                                             
                                  
                                                                           
                                  