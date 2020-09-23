'use strict';

// const Array = require('./Array');
// const Bool = require('./Bool');
// const Data = require('./Data');
// const Double = require('./Double');
// const Int = require('./Int');
// const Long = require('./Long');
// const Object = require('./Object');
// const String = require('./String');


class fields_Class
{

    // get Array() { return this.Array; };
    // get Bool() { return this.Bool; };
    // get Data() { return this.Data; };
    // get Double() { return this.Double; };
    // get Int() { return this.Int; };
    // get Long() { return this.Long; };
    // get Object() { return this.Object; };
    // get String() { return this.String; };


    Array(properties = {})
    {
        return new (require('./Array'))(properties);
    }

    Bool(properties = {}) 
    {
        return new (require('./Bool'))(properties);
    }

    Data(properties = {}) 
    {
        return new (require('./Data'))(properties);
    }

    Double(properties = {})
    {
        return new (require('./Double'))(properties);
    }

    Id(properties = {})
    {
        return new (require('./Int'))();
    }

    Int(properties = {})
    {
        return new (require('./Int'))(properties);
    }

    Long(properties = {})
    {
        return new (require('./Long'))(properties);
    }

    Object(properties = {})
    {
        return new (require('./Object'))(properties);
    }

    String(properties = {})
    {
        return new (require('./String'))(properties);
    }

}
module.exports = new fields_Class();
