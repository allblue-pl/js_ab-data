'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField')
;

class ABDDateTime extends ABDField
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
        js0.args(arguments, 'number');

        return String(value);
    }

    __unescape(value)
    {
        return Number(value);
    }

}
module.exports = ABDDateTime;
