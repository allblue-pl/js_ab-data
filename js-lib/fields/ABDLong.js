'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDLongValidator = require('../validators/ABDLongValidator'),
    SelectColumnType = require('../SelectColumnType')
;

class ABDLong extends ABDField {

    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }


    __compareDBType(dbVersion, dbType) {
        return dbType === 'bigint';
    }

    __getDBExtra(dbVersion) {
        return '';
    }

    __getDBType(dbVersion) {
        return 'bigint';
    }

    __getDefaultValue() {
        return 0;
    }

    __getDBExtra(dbVersion) {
        return '';
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDLongValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.Long;
    }

    __getType() {
        return 'Long';
    }

    __escape(value) {
        js0.args(arguments, js0.Long);

        return String(value);
    }

    __parse(value) {
        js0.args(arguments, js0.Long);

        return value;
    }

    __unescape(value) {
        return Number(value);
    }

}
module.exports = ABDLong;
