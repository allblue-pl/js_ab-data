'use strict';

const 
    js0 = require('js0'),

    // ABDArray = require('./ABDArray'),
    ABDAutoIncrementId = require('./ABDAutoIncrementId'),
    ABDBlob = require('./ABDBlob'),
    ABDBool = require('./ABDBool'), 
    // ABDData = require('./ABDData'),
    ABDDate = require('./ABDDate'),
    ABDDateTime = require('./ABDDateTime'),
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
    get ABDBlob() { return ABDBlob; };
    get ABDBool() { return ABDBool; };
    // get ABDData() { return ABDData; }
    get ABDDate() { return ABDDate; }
    get ABDDateTime() { return ABDDateTime; }
    // get ABDDouble() { return ABDDouble; };
    get ABDFloat() { return ABDFloat; };
    get ABDId() { return ABDId; };
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

    AutoIncrementId() {
        js0.args(arguments);
        return new ABDAutoIncrementId();
    }

    Blob(properties = {})  {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDBlob(properties);
    }

    Bool(properties = {})  {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDBool(properties);
    }

    Date(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDData(properties);
    }

    Date(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDDate(properties);
    }

    DateTime(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDDateTime(properties);
    }

    // Double(properties = {})
    // {
    //     return new ABDDouble(properties);
    // }

    Float(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDFloat(properties);
    }

    Id(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDId(properties);
    }

    Int(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDInt(properties);
    }

    JSON(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDJSON(properties);
    }

    Long(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDLong(properties);
    }

    // Object(properties = {})
    // {
    //     return new ABDObject(properties);
    // }

    String(size, properties = {}) {
        js0.args(arguments, 'int', [ js0.RawObject, js0.Default ]);
        return new ABDString(size, properties);
    }

    Time(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        return new ABDTime(properties);
    }

    Text(type, properties = {}) {
        js0.args(arguments, js0.Enum([ 'tiny', 'regular', 'medium' ]), 
                [ js0.RawObject, js0.Default ]);
        return new ABDText(type, properties);
    }

}
module.exports = new fields_Class();
