'use strict';

const
    abStrings = require('ab-strings'),
    abText = require('ab-text'),
    js0 = require('js0'),

    ABDFieldValidator = require('./ABDFieldValidator')
;

class ABDLongValidator extends ABDFieldValidator
{

    constructor(args)
    {
        js0.args(arguments, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
            'required': [ 'boolean', js0.Default(true) ],
            'minValue': [ js0.Int, js0.Null, js0.Default(null) ],
            'maxValue': [ js0.Int, js0.Null, js0.Default(null) ],
        }));

        super(args);
    }

    getType()
    {
        return 'Long';
    }


    __validate(validator, fieldName, value)
    {
        if (value === '') {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.notSet'));

            return;
        }

        if (!this.args['required'] && value === '')
            return;

        if (isNaN(value))
            validator.fieldError(fieldName, abText.$('abData.int_NotANumber'));
        else {
            let number = Number(value);            
            if (number % 1 !== 0)
                validator.fieldError(fieldName, abText.$('abData.int_NotAnInt'));
            else {
                if (this.args['minValue'] !== null) {
                    if (number < this.args['minValue']) {
                        validator.fieldError(fieldName, abText.$(
                                'abData.int_BelowMin',  { minValue: this.args['minValue'] }));
                    }
                }

                if (this.args['maxValue']) {
                    if (number > this.args['maxValue']) {
                        validator.fieldError(fieldName, abText.$(
                                'abData.int_AboveMax', { maxValue: this.args['maxValue'] }));
                    }
                }
            }
        }
    }

}
module.exports = ABDLongValidator;