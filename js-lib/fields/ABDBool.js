const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDBoolValidator = require('../validators/ABDBoolValidator'),
    SelectColumnType = require('../SelectColumnType')
;


class ABDBool extends ABDField {

    constructor(properties) {
        js0.args(arguments, js0.RawObject);
        super([], properties);
    }


    __compareDBType(dbVersion, dbType) {
        return dbType === 'tinyint(1)' || dbType === 'bool';
    }

    __getDBType(dbVersion) {
        return 'tinyint(1)'
    }

    __getDefaultValue() {
        return false;
    }

     __getDBExtra(dbVersion) {
        return '';
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDBoolValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.Bool;
    }

    __getDBType() {
        return 'Bool';
    }

    __getValidatorType() {
        return 'bool';
    }

    __escape(value) {
        js0.args(arguments, 'boolean');

        if (this.__parse(value))
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