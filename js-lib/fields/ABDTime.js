'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDTimeValidator = require('../validators/ABDTimeValidator')
;

class ABDTime extends ABDField
{

    constructor(properties = {})
    {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }

    getType()
    {
        return 'Time';
    }


    __getFieldValidator(fieldValidatorInfo)
    {
        return new ABDTimeValidator(fieldValidatorInfo);
    }

    __escape(value)
    {
        js0.args(arguments, 'number');

        return String(value);
    }

    __parse(value)
    {
        js0.args(arguments, 'number');

        return value;
    }

    __unescape(value)
    {
        return Number(value);
    }

}
module.exports = ABDTime;
