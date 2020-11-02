'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField')
;


class ABDBool extends ABDField
{

    constructor(properties)
    {
        super(properties);
    }

    getType()
    {
        return 'Bool';
    }

    
    __getValidatorType()
    {
        return 'bool';
    }

    __escape(value)
    {
        js0.args(arguments, 'boolean');

        if (value)
            return '1';

        return '0';
    }

    __unescape(value)
    {
        js0.args(arguments, 'string');

        return value === '1' ? true : false;
    }

}
module.exports = ABDBool;
