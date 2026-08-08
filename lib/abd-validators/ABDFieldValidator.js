import abText from "ab-text";
import ts0, { ts0Helper, ts0Virtual,                                     } from "@allblue/ts0"
import Validator from "../Validator.js";

export default          class ABDFieldValidator {
    #args                               ;

    get args()                                {
        return this.#args;
    }


    constructor(args_                        ) {
        this.#args = assert_ABDFieldValidator_Args(args_);
    }

    validate(validator           , fieldName        , value             )       {
        if (value === null) {
            if (this.args.notNull) {
                if (this.args.required)
                    validator.fieldError(fieldName, abText.$('abData.NotSet'));
                else
                    validator.fieldError(fieldName, abText.$('abData.NotNull'));
            }
        } else
            this.__validate(validator, fieldName, value);
    }


    /* Bad design choices. */
                               
                                                                                           
}


;                                     
                      
                       
  
;                                            
                     
                      
                                    
const presets_ABDFieldValidator_Args_Parsed = ts0.TPreset({
    notNull: [ "boolean", ts0.TDefault(true) ],
    required: [ "boolean", ts0.TDefault(true) ],
}, ts0.TObject("string", ts0.TRawObject));
const assert_ABDFieldValidator_Args = (value     )                                => 
        ts0.assertType(value, presets_ABDFieldValidator_Args_Parsed);