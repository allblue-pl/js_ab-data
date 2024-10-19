'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDBoolValidator = require('../validators/ABDBoolValidator'),
    SelectColumnType = require('../SelectColumnType')
;


class ABDBool extends ABDField
{

    constructor(properties) {
        super([], properties);
    }

    getSelectType() {
        return SelectColumnType.Bool;
    }

    getType() {
        return 'Bool';
    }


    __getDefaultValue() {
        return false;
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDBoolValidator(fieldValidatorInfo);
    }

    __getValidatorType() {
        return 'bool';
    }

    __escape(value) {
        js0.args(arguments, 'boolean');

        if (value)
            return '1';

        return '0';
    }

    __parse(value) {
        js0.args(arguments, 'boolean');

        if (value)
            return true;

        return false;
    }

    __unescape(value) {
        js0.args(arguments, 'boolean');

        return value ? true : false;
    }

}
module.exports = ABDBool;
