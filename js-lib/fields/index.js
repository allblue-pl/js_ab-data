'use strict';

const 
    ABDArray = require('./ABDArray'),
    ABDAutoIncrementId = require('./ABDAutoIncrementId'),
    ABDBool = require('./ABDBool'), 
    ABDData = require('./ABDData'),
    // ABDDate = require('./ABDDate'),
    // ABDDateTime = require('./ABDDateTime'),
    // ABDDouble = require('./ABDDouble'),
    ABDFloat = require('./ABDFloat'),
    ABDId = require('./ABDId'),
    ABDInt = require('./ABDInt'),
    ABDJSON = require('./ABDJSON'),
    ABDLong = require('./ABDLong'),
    // ABDObject = require('./ABDObject'),
    ABDString = require('./ABDString'),
    ABDText = require('./ABDText'),
    ABDTime = require('./ABDTime')
;


class fields_Class {

    // get ABDArray() { return ABDArray; };
    get ABDAutoIncrementId() { return ABDAutoIncrementId; };
    get ABDBool() { return ABDBool; };
    // get ABDDate() { return ABDDate; }
    // get ABDDateTime() { return ABDDateTime; }
    // get ABDData() { return ABDData; };
    // get ABDDouble() { return ABDDouble; };
    get ABDFloat() { return ABDFloat; };
    get ABDInt() { return ABDInt; };
    get ABDJSON() { return ABDJSON; };
    get ABDLong() { return ABDLong; };
    // get ABDObject() { return ABDObject; };
    get ABDString() { return ABDString; };
    get ABDTime() { return ABDTime; };
    get ABDText() { return ABDText; };


    // Array(properties = {})
    // {
    //     return new ABDArray(properties);
    // }

    AutoIncrementId(properties = {}) {
        return new ABDAutoIncrementId(properties);
    }

    Bool(properties = {})  {
        return new ABDBool(properties);
    }

    // Data(properties = {}) 
    // {
    //     return new ABDData(properties);
    // }

    // Date(properties = {}) 
    // {
    //     return new ABDDate(properties);
    // }

    // DateTime(properties = {}) 
    // {
    //     return new ABDDateTime(properties);
    // }

    // Double(properties = {})
    // {
    //     return new ABDDouble(properties);
    // }

    Float(properties = {}) {
        return new ABDFloat(properties);
    }

    Id(properties = {}) {
        return new ABDId(properties);
    }

    Int(properties = {}) {
        return new ABDInt(properties);
    }

    JSON(properties = {}) {
        return new ABDJSON(properties);
    }

    Long(properties = {}) {
        return new ABDLong(properties);
    }

    // Object(properties = {})
    // {
    //     return new ABDObject(properties);
    // }

    String(size, properties = {}) {
        return new ABDString(size, properties);
    }

    Time(properties = {}) {
        return new ABDTime(properties);
    }

    Text(type, properties = {}) {
        return new ABDText(type, properties);
    }

}
module.exports = new fields_Class();
