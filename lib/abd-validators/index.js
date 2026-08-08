import ABDBoolValidator, {                            } from "./ABDBoolValidator.js";
import ABDEmailValidator, {                             } from "./ABDEmailValidator.js";
import ABDIntValidator, {                           } from "./ABDIntValidator.js";
import ABDJSONValidator, {                            } from "./ABDJSONValidator.js";
import ABDFloatValidator, {                             } from "./ABDFloatValidator.js";
import ABDLongValidator, {                            } from "./ABDLongValidator.js";
import ABDStringValidator, {                              } from "./ABDStringValidator.js";

class abdValidators_Class {
    get ABDBoolValidator()                          { return ABDBoolValidator; }
    get ABDEmailValidator()                           { return ABDEmailValidator; };
    get ABDIntValidator()                         { return ABDIntValidator; };    
    get ABDJSONValidator()                          { return ABDJSONValidator; };
    get ABDFloatValidator()                           { return ABDFloatValidator; };
    get ABDLongValidator()                          { return ABDLongValidator; };
    get ABDStringValidator()                            { return ABDStringValidator; };


    Bool(args                        = {})                   {
        return new ABDBoolValidator(args);
    }

    Email(args                        )                    {
        return new ABDEmailValidator(args);
    }

    Int(args                       = {})                  {
        return new ABDIntValidator(args);
    }

    JSON(args                        = { type: "medium" })                   {
        return new ABDJSONValidator(args);
    }

    Float(args                         = {})                    {
        return new ABDFloatValidator(args);
    }

    Long(args                        = {})                   {
        return new ABDLongValidator(args);
    }

    String(args                          = {})                     {
        return new ABDStringValidator(args);
    }

}
const abdValidators = new abdValidators_Class();
export default abdValidators;
