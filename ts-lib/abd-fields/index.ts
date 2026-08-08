import ts0 from "@allblue/ts0"

import ABDAutoIncrementId from "./ABDAutoIncrementId.ts";
import ABDBlob, { type ABDBlob_Type } from "./ABDBlob.ts";
import ABDBool from "./ABDBool.ts";
import ABDDate from "./ABDDate.ts";
import ABDDateTime from "./ABDDateTime.ts";
import ABDFloat from "./ABDFloat.ts";
import ABDId from "./ABDId.ts";
import ABDInt from "./ABDInt.ts";
import ABDJSON, { type ABDJSON_Type } from "./ABDJSON.ts";
import ABDLong from "./ABDLong.ts";
import ABDString from "./ABDString.ts";
import ABDText, { type ABDText_Type } from "./ABDText.ts";
import ABDTime from "./ABDTime.ts";
import type { ABDField_Properties } from "./ABDField.ts";


class abdField_Class {
    // get ABDArray() { return ABDArray; };
    get ABDAutoIncrementId(): typeof ABDAutoIncrementId { return ABDAutoIncrementId; };
    get ABDBlob(): typeof ABDBlob { return ABDBlob; };
    get ABDBool(): typeof ABDBool { return ABDBool; };
    // get ABDData() { return ABDData; }
    get ABDDate(): typeof ABDDate { return ABDDate; }
    get ABDDateTime(): typeof ABDDateTime { return ABDDateTime; }
    // get ABDDouble() { return ABDDouble; };
    get ABDFloat(): typeof ABDFloat { return ABDFloat; };
    get ABDId(): typeof ABDId { return ABDId; };
    get ABDInt(): typeof ABDInt { return ABDInt; };
    get ABDJSON(): typeof ABDJSON { return ABDJSON; };
    get ABDLong(): typeof ABDLong { return ABDLong; };
    // get ABDObject() { return ABDObject; };
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

    // Data(properties = {}): ABDData {
    //     return new ABDData(properties);
    // }

    Date(properties: ABDField_Properties = {}): ABDDate {
        return new ABDDate(properties);
    }

    DateTime(properties: ABDField_Properties = {}): ABDDateTime {
        return new ABDDateTime(properties);
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

    Int(properties: ABDField_Properties = {}): ABDInt {
        return new ABDInt(properties);
    }

    JSON(type: ABDJSON_Type, properties: ABDField_Properties = {}): ABDJSON {
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
