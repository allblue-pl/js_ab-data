'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField')
;

class ABDTime extends ABDField
{

    constructor(properties = {})
    {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super(properties);
    }

    getType()
    {
        return 'String';
    }


    __escape(value)
    {
        js0.args(arguments, js0.Int);

        if (value === null)
            return 'NULL';

        return String(value);
    }

    __unescape(value)
    {
        js0.args(arguments, 'string');

        return BigInt(value);
    }

}
module.exports = ABDTime;
