'use strict';

const 
    js0 = require('js0'),

    ABDField = require('./ABDField'),

    ABDIntValidator = require('../validators/ABDIntValidator'),
    SelectColumnType = require('../SelectColumnType')
;


class ABDInt extends ABDField
{

    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }

    getSelectType() {
        return SelectColumnType.Int;
    }

    getType() {
        return 'Int';
    }


    __getDefaultValue() {
        return 0;
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDIntValidator(fieldValidatorInfo);
    }

    __escape(value) {
        js0.args(arguments, 'number');

        return String(this.__parse(value));
    }

    __parse(value) {
        js0.args(arguments, 'number');

        return Math.round(value);
    }

    __unescape(value) {
        js0.args(arguments, null);
            
        return parseInt(value);
    }

}
module.exports = ABDInt;
