import ABDAutoIncrementId from "./ABDAutoIncrementId.ts";
import ABDBlob, { type ABDBlob_Type } from "./ABDBlob.ts";
import ABDBool from "./ABDBool.ts";
import ABDDate from "./ABDDate.ts";
import ABDDateTime from "./ABDDateTime.ts";
import ABDFloat from "./ABDFloat.ts";
import ABDId from "./ABDId.ts";
import ABDInt, { type ABDInt_Properties } from "./ABDInt.ts";
import ABDJSON, { type ABDJSON_Type } from "./ABDJSON.ts";
import ABDLong from "./ABDLong.ts";
import ABDString from "./ABDString.ts";
import ABDText, { type ABDText_Type } from "./ABDText.ts";
import ABDTime from "./ABDTime.ts";
import type { ABDField_Properties } from "./ABDField.ts";
import type { ABDData_Type } from "./ABDData.ts";
import type { ABDataDefValueType } from "../abDataDefTypes.ts";
import ABDData from "./ABDData.ts";
import ABDColumnRef from "./ABDColumnRef.ts";
import ABDIdRef from "./ABDIdRef.ts";
import ABDEnum from "./ABDEnum.ts";
import type { ABDBlobValidator_Args } from "../abd-validators/ABDBlobValidator.ts";
import type ABDFieldValidator from "../abd-validators/ABDFieldValidator.ts";
import type { ABDBoolValidator_Args } from "../abd-validators/ABDBoolValidator.ts";
import type { ABDTimeValidator_Args } from "../abd-validators/ABDTimeValidator.ts";
import type { ABDStringValidator_Args } from "../abd-validators/ABDStringValidator.ts";
import type { ABDLongValidator_Args } from "../abd-validators/ABDLongValidator.ts";
import type { ABDFloatValidator_Args } from "../abd-validators/ABDFloatValidator.ts";
import type { ABDEnumValidator_Args } from "../abd-validators/ABDEnumValidator.ts";
import type { ABDIntValidator_Args } from "../abd-validators/ABDIntValidator.ts";
declare class abdField_Class {
    get ABDAutoIncrementId(): typeof ABDAutoIncrementId;
    get ABDBlob(): typeof ABDBlob;
    get ABDBool(): typeof ABDBool;
    get ABDData(): typeof ABDData;
    get ABDDate(): typeof ABDDate;
    get ABDDateTime(): typeof ABDDateTime;
    get ABDEnum(): typeof ABDEnum;
    get ABDFloat(): typeof ABDFloat;
    get ABDId(): typeof ABDId;
    get ABDInt(): typeof ABDInt;
    get ABDJSON(): typeof ABDJSON;
    get ABDLong(): typeof ABDLong;
    get ABDIdRef(): typeof ABDIdRef;
    get ABDString(): typeof ABDString;
    get ABDTime(): typeof ABDTime;
    get ABDText(): typeof ABDText;
    AutoIncrementId(): ABDAutoIncrementId;
    Blob(type: ABDBlob_Type, properties?: ABDField_Properties): ABDBlob;
    Bool(properties?: ABDField_Properties): ABDBool;
    ColumnRef(tableName: string, columnName: string): ABDColumnRef;
    Data(dataDef: ABDataDefValueType, type: ABDData_Type, properties?: ABDField_Properties): ABDData;
    Date(properties?: ABDField_Properties): ABDDate;
    DateTime(properties?: ABDField_Properties): ABDDateTime;
    Enum(values: Array<string>, properties?: ABDField_Properties): ABDEnum;
    Float(properties?: ABDField_Properties): ABDFloat;
    Id(): ABDId;
    IdRef(properties?: ABDField_Properties): ABDIdRef;
    Int(properties?: ABDField_Properties): ABDInt;
    JSON(type: ABDJSON_Type, properties?: ABDInt_Properties): ABDJSON;
    Long(properties?: ABDField_Properties): ABDLong;
    String(size: number, properties?: ABDField_Properties): ABDString;
    Time(properties?: {}): ABDTime;
    Text(type: ABDText_Type, properties?: {}): ABDText;
}
declare const abdFields: abdField_Class;
export default abdFields;
export type ABDFieldInfo = [
    string,
    ABDAutoIncrementId
] | [
    string,
    ABDBlob,
    ABDBlobValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDBool,
    ABDBoolValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDData,
    ABDStringValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDDate,
    ABDStringValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDDateTime,
    ABDStringValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDEnum,
    ABDEnumValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDFloat,
    ABDFloatValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDId,
    ABDLongValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDInt,
    ABDIntValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDJSON,
    ABDStringValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDLong,
    ABDLongValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDIdRef,
    ABDLongValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDString,
    ABDStringValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDTime,
    ABDTimeValidator_Args,
    Array<ABDFieldValidator>?
] | [
    string,
    ABDText,
    ABDStringValidator_Args,
    Array<ABDFieldValidator>?
];
