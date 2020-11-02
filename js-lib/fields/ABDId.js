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


    __getValidatorType()
    {
        return 'long';
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
module.exports = ABDId;
