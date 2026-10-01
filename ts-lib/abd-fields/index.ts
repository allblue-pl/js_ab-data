import ts0 from "@allblue/ts0"

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
import type { ABDField_Properties, ABDField_Properties_Base } from "./ABDField.ts";
import type ABDField from "./ABDField.ts";
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
import type { ABDFieldValidator_Args } from "../abd-validators/ABDFieldValidator.ts";
import type { ABDFloatValidator_Args } from "../abd-validators/ABDFloatValidator.ts";
import type { ABDEnumValidator_Args } from "../abd-validators/ABDEnumValidator.ts";
import type { ABDIntValidator_Args } from "../abd-validators/ABDIntValidator.ts";


class abdField_Class {
    // get ABDArray() { return ABDArray; };
    get ABDAutoIncrementId(): typeof ABDAutoIncrementId { return ABDAutoIncrementId; };
    get ABDBlob(): typeof ABDBlob { return ABDBlob; };
    get ABDBool(): typeof ABDBool { return ABDBool; };
    get ABDData(): typeof ABDData { return ABDData; }
    get ABDDate(): typeof ABDDate { return ABDDate; }
    get ABDDateTime(): typeof ABDDateTime { return ABDDateTime; }
    get ABDEnum(): typeof ABDEnum { return ABDEnum; }
    // get ABDDouble() { return ABDDouble; };
    get ABDFloat(): typeof ABDFloat { return ABDFloat; };
    get ABDId(): typeof ABDId { return ABDId; };
    get ABDInt(): typeof ABDInt { return ABDInt; };
    get ABDJSON(): typeof ABDJSON { return ABDJSON; };
    get ABDLong(): typeof ABDLong { return ABDLong; };
    get ABDIdRef(): typeof ABDIdRef { return ABDIdRef; };
    get ABDString(): typeof ABDString { return ABDString; };
    get ABDTime(): typeof ABDTime { return ABDTime; };
    get ABDText(): typeof ABDText { return ABDText; };


    // Array(properties = {})
    // {
    //     return new ABDArray(properties);
    // }

    AutoIncrementId(): ABDAutoIncrementId {
        return new ABDAutoIncrementId();
    }

    Blob(type: ABDBlob_Type, properties: ABDField_Properties = {}): ABDBlob  {
        return new ABDBlob(type, properties);
    }

    Bool(properties: ABDField_Properties = {}): ABDBool  {
        return new ABDBool(properties);
    }

    ColumnRef(tableName: string, columnName: string): ABDColumnRef {
        return new ABDColumnRef(tableName, columnName);
    }

    Data(dataDef: ABDataDefValueType, type: ABDData_Type, 
            properties: ABDField_Properties = {}): ABDData {
        return new ABDData(dataDef, type, properties);
    }

    Date(properties: ABDField_Properties = {}): ABDDate {
        return new ABDDate(properties);
    }

    DateTime(properties: ABDField_Properties = {}): ABDDateTime {
        return new ABDDateTime(properties);
    }

    Enum(values: Array<string>, properties: ABDField_Properties = {}): ABDEnum {
        return new ABDEnum(values, properties);
    }


    // Double(properties = {})
    // {
    //     return new ABDDouble(properties);
    // }

    Float(properties: ABDField_Properties = {}): ABDFloat {
        return new ABDFloat(properties);
    }

    Id(): ABDId {
        return new ABDId();
    }

    IdRef(properties: ABDField_Properties = {}): ABDIdRef {
        return new ABDIdRef(properties);
    }

    Int(properties: ABDField_Properties = {}): ABDInt {
        return new ABDInt(properties);
    }

    JSON(type: ABDJSON_Type, properties: ABDInt_Properties = {}): ABDJSON {
        return new ABDJSON(type, properties);
    }

    Long(properties: ABDField_Properties = {}): ABDLong {
        return new ABDLong(properties);
    }

    // Object(properties = {})
    // {
    //     return new ABDObject(properties);
    // }

    String(size: number, properties: ABDField_Properties = {}): ABDString {
        return new ABDString(size, properties);
    }

    Time(properties = {}): ABDTime {
        return new ABDTime(properties);
    }

    Text(type: ABDText_Type, properties = {}): ABDText {
        return new ABDText(type, properties);
    }
}
const abdFields = new abdField_Class();
export default abdFields;

export type ABDFieldInfo =
    [ string, ABDAutoIncrementId ] |
    [ string, ABDBlob, ABDBlobValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDBool, ABDBoolValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDData, ABDStringValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDDate, ABDStringValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDDateTime, ABDStringValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDEnum, ABDEnumValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDFloat, ABDFloatValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDId, ABDLongValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDInt, ABDIntValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDJSON, ABDStringValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDLong, ABDLongValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDIdRef, ABDLongValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDString, ABDStringValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDTime, ABDTimeValidator_Args, Array<ABDFieldValidator>? ] |
    [ string, ABDText, ABDStringValidator_Args, Array<ABDFieldValidator>? ]
;