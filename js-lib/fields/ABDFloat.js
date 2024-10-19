'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDFloatValidator = require('../validators/ABDFloatValidator'),
    SelectColumnType = require('../SelectColumnType')
;

class ABDFloat extends ABDField
{

    constructor(properties) {
        super([], properties);
    }

    getSelectType() {
        return SelectColumnType.Float;
    }

    getType() {
        return 'Float';
    }


    __getFieldValidator(fieldValidatorInfo) {
        return new ABDFloatValidator(fieldValidatorInfo);
    }

    __escape(value) {
        js0.args(arguments, 'number');

        return String(value);
    }

    __parse(value) {
        js0.args(arguments, 'number');

        return value;
    }

    __unescape(value) {
        return parseFloat(value);
    }

}
module.exports = ABDFloat;