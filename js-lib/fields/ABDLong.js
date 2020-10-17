'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField')
;

class ABDLong extends ABDField
{

    constructor(properties = {})
    {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super(properties);
    }

    getType()
    {
        return 'Long';
    }


    __escape(value)
    {
        js0.args(arguments, js0.Long);

        return String(value);
    }

    __unescape(value)
    {
        return BigInt(value);
    }

}
module.exports = ABDLong;
