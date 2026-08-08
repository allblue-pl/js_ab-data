import ABDBoolValidator, { type ABDBoolValidator_Args } from "./ABDBoolValidator.ts";
import ABDEmailValidator, { type ABDEmailValidator_Args } from "./ABDEmailValidator.ts";
import ABDIntValidator, { type ABDIntValidator_Args } from "./ABDIntValidator.ts";
import ABDJSONValidator, { type ABDJSONValidator_Args } from "./ABDJSONValidator.ts";
import ABDFloatValidator, { type ABDFloatValidator_Args } from "./ABDFloatValidator.ts";
import ABDLongValidator, { type ABDLongValidator_Args } from "./ABDLongValidator.ts";
import ABDStringValidator, { type ABDStringValidator_Args } from "./ABDStringValidator.ts";

class abdValidators_Class {
    get ABDBoolValidator(): typeof ABDBoolValidator { return ABDBoolValidator; }
    get ABDEmailValidator(): typeof ABDEmailValidator { return ABDEmailValidator; };
    get ABDIntValidator(): typeof ABDIntValidator { return ABDIntValidator; };    
    get ABDJSONValidator(): typeof ABDJSONValidator { return ABDJSONValidator; };
    get ABDFloatValidator(): typeof ABDFloatValidator { return ABDFloatValidator; };
    get ABDLongValidator(): typeof ABDLongValidator { return ABDLongValidator; };
    get ABDStringValidator(): typeof ABDStringValidator { return ABDStringValidator; };


    Bool(args: ABDBoolValidator_Args = {}): ABDBoolValidator {
        return new ABDBoolValidator(args);
    }

    Email(args: ABDEmailValidator_Args): ABDEmailValidator {
        return new ABDEmailValidator(args);
    }

    Int(args: ABDIntValidator_Args = {}): ABDIntValidator {
        return new ABDIntValidator(args);
    }

    JSON(args: ABDJSONValidator_Args = { type: "medium" }): ABDJSONValidator {
        return new ABDJSONValidator(args);
    }

    Float(args: ABDFloatValidator_Args = {}): ABDFloatValidator {
        return new ABDFloatValidator(args);
    }

    Long(args: ABDLongValidator_Args = {}): ABDLongValidator {
        return new ABDLongValidator(args);
    }

    String(args: ABDStringValidator_Args = {}): ABDStringValidator {
        return new ABDStringValidator(args);
    }

}
const abdValidators = new abdValidators_Class();
export default abdValidators;
