'use strict';

const
    abStrings = require('ab-strings'),
    abText = require('ab-text'),
    js0 = require('js0'),

    ABDFieldValidator = require('./ABDFieldValidator')
;

class ABDJSONValidator extends ABDFieldValidator
{

    constructor(args) {
        js0.args(arguments, js0.RawObject);
        js0.typeE(args, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
        }));

        super(args);
    }

    getType() {
        return 'JSON';
    }


    __validate(validator, fieldName, value) {
        if (!js0.typeE(value, js0.Preset({
            value: null,
                }))) {
            validator.fieldError(fieldName, abText.$(
                    'abData.Errors_WrongJSONFieldFormat'));
        }
    }

}
module.exports = ABDJSONValidator;