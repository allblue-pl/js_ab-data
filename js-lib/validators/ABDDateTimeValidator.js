'use strict';

const
    abStrings = require('ab-strings'),
    abText = require('ab-text'),
    js0 = require('js0'),

    ABDFieldValidator = require('./ABDFieldValidator')
;

class ABDDateTimeValidator extends ABDFieldValidator
{

    constructor(args)
    {
        js0.args(arguments, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
            'required': [ 'boolean', js0.Default(true) ],
            'minDate': [ js0.Long, js0.Null, js0.Default(null) ],
            'maxDate': [ js0.Long, js0.Null, js0.Default(null) ],
        }));

        super(args);
    }


    __validate(validator, fieldName, value)
    {
        if (value === null) {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.notSet'));
            else
                return;
        } else {
            if (isNaN(value)) {
                validator.fieldError(fieldName, abText.$('abData.date_WrongFormat'));
                return;
            }

            value = Number.parseInt(value);

            if (this.args['minDate'] !== null) {
                if (value < this.args['minDate']) {
                    validator.fieldError(fieldName, abText.$('abData.date_BelowMinDate',
                            abDate.format_DateTime(abText.$('abData.date_Format'), 
                            this.args['minDate'])));
                }
            }

            if (this.args['maxDate'] !== null) {
                if (value > this.args['maxDate']) {
                    validator.fieldError(fieldName, abText.$('abData.date_AboveMaxDate', { 
                        maxDate: abDate.format_DateTime(abText.$(
                                'abDate.format_DateTime'), this.args['maxDate']),
                    }));
                }
            }
        }
    }

}
module.exports = ABDDateTimeValidator;