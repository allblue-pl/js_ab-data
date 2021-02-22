'use strict';

const
    abStrings = require('ab-strings'),
    abText = require('ab-text'),
    js0 = require('js0'),

    ABDFieldValidator = require('./ABDFieldValidator')
;

class ABDStringValidator extends ABDFieldValidator
{

    constructor(args)
    {
        js0.args(arguments, js0.Preset({
            'notNull': [ 'boolean', js0.Default(true) ],
            'required': [ 'boolean', js0.Default(true) ],
            'minLength': [ js0.Int, js0.Null, js0.Default(null) ],
            'maxLength': [ js0.Int, js0.Null, js0.Default(null) ],
            'regexp': [ 'string', js0.Null, js0.Default(null) ],
            'trim': [ 'boolean', js0.Default(false) ],
            'chars': [ 'string', js0.Default(abStrings.getCharsRegExp_Basic()) ],
        }));

        super(args);
    }

    getType()
    {
        return 'String';
    }


    __validate(validator, fieldName, value)
    {
        if (this.args['trim'])
            value = value.trim();

        if (value === '') {
            if (this.args['required'])
                validator.fieldError(fieldName, abText.$('abData.notSet'));

            return;
        } else {
            if (this.args['minLength'] !== null) {
                if (value.length < this.args['minLength']) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.errors_BelowMinLength', 
                            [this.args['minLength']]));
                }
            }

            if (this.args['maxLength'] !== null) {
                if (this.args['maxLength'] > 0) {
                    if (value.length > this.args['maxLength']) {
                        validator.fieldError(fieldName, abText.$(
                                'abData.errors_AboveMaxLength', 
                                { maxLength: this.args['maxLength'] }));
                    }
                }
            }

            if (this.args['regexp'] !== null) {
                // regexp = str_replace('#', '\\#', this.args['regexp'][0]);
                let regexp = this.args['regexp'][0];

                if (!(new RegExp(`${regexp}`)).test(value)) {
                    validator.fieldError(fieldName, abText.$('abData.errors_WrongFormat',
                        { format: this.args['regexp'][1] }));
                }
            }

            if (this.args['chars'] !== null) {
                let chars_Escaped =  this.args['chars']; //abStrings.escapeRegExpChars(this.args['chars']);
                // value = ' hello ';
                // echo '#' . chars . '#' . value . '#';

                if (!(new RegExp(`^[${chars_Escaped}]*$`)).test(value)) {
                    let notAllowedChars = [];
                    let re = new RegExp(`[${chars_Escaped}]`, 'g');

                    while (true) {
                        let match = re.exec(value);
                        if (!match)
                            break;

                        notAllowedChars.push(match[0]);
                    }

                    let notAllowedChars_Str = notAllowedChars.join(', ');

                    // not_allowed_chars = str_replace('\\\\', '&#92;', not_allowed_chars);
                    // not_allowed_chars = str_replace('\\', '', not_allowed_chars);
                    // not_allowed_chars = str_replace('&#92;', '\\', not_allowed_chars);

                    validator.fieldError(fieldName, abText.$(
                            'abData.errors_NotAllowedCharacters',
                            { notAllowedChars: notAllowedChars_Str }));
                }
            }
        }
    }

}
module.exports = ABDStringValidator;