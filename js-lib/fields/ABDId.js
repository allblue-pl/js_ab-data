'use strict';

const 
    js0 = require('js0'),

    ABDField = require('./ABDField')
;

class ABDId extends ABDField
{

    constructor(properties)
    {
        js0.args(arguments);
        super(properties);
    }

    getType()
    {
        return 'Id';
    }


    __escape(value)
    {
        js0.args(arguments, [ js0.Int, js0.Null ]);

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
module.exports = ABDId;
