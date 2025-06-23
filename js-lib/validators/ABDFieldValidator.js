'use strict';

const
    abText = require('ab-text'),
    js0 = require('js0')
;

class ABDFieldValidator {

    get args() {
        return this._args;
    }


    constructor(args) {
        js0.args(arguments, js0.RawObject);

        this._args = args;
    }

    getType() {
        js0.virtual(this);
    }

    validate(validator, fieldName, value) {
        js0.args(arguments, require('../Validator'), 'string', null);

        if (value === null) {
            if (this.args['notNull']) {
                if (this.args['required'])
                    validator.fieldError(fieldName, abText.$('abData.NotSet'));
                else
                    validator.fieldError(fieldName, abText.$('abData.NotNull'));
            }
        } else
            this.__validate(validator, fieldName, value);
    }


    __validate(value) { js0.virtual(this); }

}
module.exports = ABDFieldValidator;