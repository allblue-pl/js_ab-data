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
        js0.args(arguments, args);
        js0.typeE(args, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
        }));

        super(args);
    }

    getType()
    {
        return 'JSON';
    }


    __validate(validator, fieldName, value)
    {
        
    }

}
module.exports = ABDJSONValidator;