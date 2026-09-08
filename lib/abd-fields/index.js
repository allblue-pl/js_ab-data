import ts0 from "@allblue/ts0"

import ABDAutoIncrementId from "./ABDAutoIncrementId.js";
import ABDBlob, {                   } from "./ABDBlob.js";
import ABDBool from "./ABDBool.js";
import ABDDate from "./ABDDate.js";
import ABDDateTime from "./ABDDateTime.js";
import ABDFloat from "./ABDFloat.js";
import ABDId from "./ABDId.js";
import ABDInt from "./ABDInt.js";
import ABDJSON, {                   } from "./ABDJSON.js";
import ABDLong from "./ABDLong.js";
import ABDString from "./ABDString.js";
import ABDText, {                   } from "./ABDText.js";
import ABDTime from "./ABDTime.js";
                                                         
                                          
                                                 
                                                               
import ABDData from "./ABDData.js";
import ABDColumnRef from "./ABDColumnRef.js";
import ABDIdRef from "./ABDIdRef.js";


class abdField_Class {
    // get ABDArray() { return ABDArray; };
    get ABDAutoIncrementId()                            { return ABDAutoIncrementId; };
    get ABDBlob()                 { return ABDBlob; };
    get ABDBool()                 { return ABDBool; };
    get ABDData()                 { return ABDData; }
    get ABDDate()                 { return ABDDate; }
    get ABDDateTime()                     { return ABDDateTime; }
    // get ABDDouble() { return ABDDouble; };
    get ABDFloat()                  { return ABDFloat; };
    get ABDId()               { return ABDId; };
    get ABDInt()                { return ABDInt; };
    get ABDJSON()                 { return ABDJSON; };
    get ABDLong()                 { return ABDLong; };
    get ABDIdRef()                  { return ABDIdRef; };
    get ABDString()                   { return ABDString; };
    get ABDTime()                 { return ABDTime; };
    get ABDText()                 { return ABDText; };


    // Array(properties = {})
    // {
    //     return new ABDArray(properties);
    // }

    AutoIncrementId()                     {
        return new ABDAutoIncrementId();
    }

    Blob(type              , properties                      = {})           {
        return new ABDBlob(type, properties);
    }

    Bool(properties                      = {})           {
        return new ABDBool(properties);
    }

    ColumnRef(tableName        , columnName        )               {
        return new ABDColumnRef(tableName, columnName);
    }

    Data(dataDef                    , type              , 
            properties                      = {})          {
        return new ABDData(dataDef, type, properties);
    }

    Date(properties                      = {})          {
        return new ABDDate(properties);
    }

    DateTime(properties                      = {})              {
        return new ABDDateTime(properties);
    }

    // Double(properties = {})
    // {
    //     return new ABDDouble(properties);
    // }

    Float(properties                      = {})           {
        return new ABDFloat(properties);
    }

    Id()        {
        return new ABDId();
    }

    IdRef(properties                      = {})           {
        return new ABDId(properties);
    }

    Int(properties                      = {})         {
        return new ABDInt(properties);
    }

    JSON(type              , properties                      = {})          {
        return new ABDJSON(type, properties);
    }

    Long(properties                      = {})          {
        return new ABDLong(properties);
    }

    // Object(properties = {})
    // {
    //     return new ABDObject(properties);
    // }

    String(size        , properties                      = {})            {
        return new ABDString(size, properties);
    }

    Time(properties = {})          {
        return new ABDTime(properties);
    }

    Text(type              , properties = {})          {
        return new ABDText(type, properties);
    }
}
const abdFields = new abdField_Class();
export default abdFields;