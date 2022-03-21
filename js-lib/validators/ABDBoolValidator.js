'use strict';

const
    abStrings = require('ab-strings'),
    abText = require('ab-text'),
    js0 = require('js0'),

    ABDFieldValidator = require('./ABDFieldValidator')
;

class ABDBoolValidator extends ABDFieldValidator
{

    constructor(args)
    {
        js0.args(arguments, js0.RawObject)
        js0.typeE(args, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
            'required': [ 'boolean', js0.Default(true) ],
        }));

        super(args);
    }

    getType()
    {
        return 'Bool';
    }


    __validate(validator, fieldName, value)
    {
        if (!value) {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.NotChecked'));
        }
    }

}
module.exports = ABDBoolValidator;