import ABDBoolValidator, { type ABDBoolValidator_Args } from "./ABDBoolValidator.ts";
import ABDEmailValidator, { type ABDEmailValidator_Args } from "./ABDEmailValidator.ts";
import ABDIntValidator, { type ABDIntValidator_Args } from "./ABDIntValidator.ts";
import ABDJSONValidator, { type ABDJSONValidator_Args } from "./ABDJSONValidator.ts";
import ABDFloatValidator, { type ABDFloatValidator_Args } from "./ABDFloatValidator.ts";
import ABDLongValidator, { type ABDLongValidator_Args } from "./ABDLongValidator.ts";
import ABDStringValidator, { type ABDStringValidator_Args } from "./ABDStringValidator.ts";
declare class abdValidators_Class {
    get ABDBoolValidator(): typeof ABDBoolValidator;
    get ABDEmailValidator(): typeof ABDEmailValidator;
    get ABDIntValidator(): typeof ABDIntValidator;
    get ABDJSONValidator(): typeof ABDJSONValidator;
    get ABDFloatValidator(): typeof ABDFloatValidator;
    get ABDLongValidator(): typeof ABDLongValidator;
    get ABDStringValidator(): typeof ABDStringValidator;
    Bool(args?: ABDBoolValidator_Args): ABDBoolValidator;
    Email(args: ABDEmailValidator_Args): ABDEmailValidator;
    Int(args?: ABDIntValidator_Args): ABDIntValidator;
    JSON(args?: ABDJSONValidator_Args): ABDJSONValidator;
    Float(args?: ABDFloatValidator_Args): ABDFloatValidator;
    Long(args?: ABDLongValidator_Args): ABDLongValidator;
    String(args?: ABDStringValidator_Args): ABDStringValidator;
}
declare const abdValidators: abdValidators_Class;
export default abdValidators;
