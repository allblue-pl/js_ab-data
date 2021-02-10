'use strict';

const 
    abDate = require('ab-date'),
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDDateTimeValidator = require('../validators/ABDDateTimeValidator')
;

class ABDDate extends ABDField
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


    __getFieldValidator(fieldValidatorInfo)
    {
        return new ABDDateTimeValidator(fieldValidatorInfo);
    }

    __escape(value)
    {
        return '\'' + abDate.format_DateTime_UTC(Number(value), 
                'YYYY-MM-DD HH:mm:ss') + '\'';
    }

    __unescape(value)
    {
        return abDate.strToTime_UTC(value, 'YYYY-MM-DD HH:mm:ss');
    }

}
module.exports = ABDDate;
