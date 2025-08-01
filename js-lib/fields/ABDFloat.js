'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDFloatValidator = require('../validators/ABDFloatValidator'),
    SelectColumnType = require('../SelectColumnType')
;

class ABDFloat extends ABDField {

    constructor(properties) {
        super([], properties);
    }


    __compareDBType(dbVersion, dbType) {
        return dbType === 'float';
    }

    __getDefaultValue() {
        return 0.0;
    }

    __getDBExtra(dbVersion) {
        return '';
    }

    __getDBType(dbVersion) {
        return 'float';
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDFloatValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.Float;
    }

    __getType() {
        return 'Float';
    }

    __escape(value) {
        js0.args(arguments, 'number');

        return String(this.__parse(value));
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