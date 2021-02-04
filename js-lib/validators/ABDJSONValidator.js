'use strict';

const
    abStrings = require('ab-strings'),
    abText = require('ab-text'),
    js0 = require('js0'),

    ABDFieldValidator = require('./ABDFieldValidator')
;

class ABDJSONValidator extends ABDFieldValidator
{

    constructor(args)
    {
        js0.args(arguments, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
        }));

        super(args);
    }


    __validate(validator, fieldName, value)
    {
        
    }

}
module.exports = ABDJSONValidator;