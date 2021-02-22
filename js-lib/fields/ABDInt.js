'use strict';

const 
    js0 = require('js0'),

    ABDField = require('./ABDField'),

    ABDIntValidator = require('../validators/ABDIntValidator')
;


class ABDInt extends ABDField
{

    constructor(properties = {})
    {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }

    getType()
    {
        return 'Int';
    }


    __getFieldValidator(fieldValidatorInfo)
    {
        return new ABDIntValidator(fieldValidatorInfo);
    }

    __escape(value)
    {
        if (value === null)
            return 'NULL';

        return String(value);
    }

    __unescape(value)
    {
        js0.args(arguments);
            
        return parseInt(value);
    }

}
module.exports = ABDInt;
