'use strict';

const
    abStrings = require('ab-strings'),
    abText = require('ab-text'),
    js0 = require('js0'),

    ABDFieldValidator = require('./ABDFieldValidator')
;

class ABDFloatValidator extends ABDFieldValidator
{

    constructor(args)
    {
        js0.args(arguments, js0.RawObject);
        js0.typeE(args, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
            'required': [ 'boolean', js0.Default(true) ],
            'minValue': [ 'number', js0.Null, js0.Default(null) ],
            'maxValue': [ 'number', js0.Null, js0.Default(null) ],
        }));

        super(args);
    }

    getType()
    {
        return 'Float';
    }


    __validate(validator, fieldName, value)
    {
        if (value === '') {
            if (this.args['required'])
                this.fieldError(validator, fieldName, abText.$('abData.NotSet'));

            return;
        }

        if (!this.args['required'] && value === '')
            return;

        if (isNaN(value))
            validator.fieldError(fieldName, abText.$('abData.Int_NotANumber'));
        else {
            let number = Number(value);
            if (this.args['minValue'] !== null) {
                if (number < this.args['minValue']) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.Int_BelowMin',  { minValue: this.args['minValue'] }));
                }
            }

            if (this.args['maxValue']) {
                if (number > this.args['maxValue']) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.Int_AboveMax', { maxValue: this.args['maxValue'] }));
                }
            }
        }
    }

}
module.exports = ABDFloatValidator;