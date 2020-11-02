'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField')
;

class ABDFloat extends ABDField
{

    constructor(properties)
    {
        super(properties);
    }

    getType()
    {
        return 'Float';
    }


    __getValidatorType()
    {
        return 'number';
    }

    __escape(value)
    {
        js0.args(arguments, 'number');

        return String(value);
    }

    __unescape(value)
    {
        return parseFloat(value);
    }

}
module.exports = ABDFloat;