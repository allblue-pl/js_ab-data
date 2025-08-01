'use strict';

const 
    js0 = require('js0'),

    ABDField = require('./ABDField'),

    ABDIntValidator = require('../validators/ABDIntValidator'),
    SelectColumnType = require('../SelectColumnType')
;

class ABDAutoIncrementId extends ABDField {
    get isLong() {
        return this._isLong;
    }

    constructor() {
        js0.args(arguments);
        super([], { notNull: true, });
    }


    __compareDBType(dbVersion, dbType) {
        if (this.isLong)
            return dbType === 'bigint';
        
        return dbType === 'int';
    }

    __getDBType(dbVersion) {
        return 'int';
    }

    __getDefaultValue() {
        return 0;
    }

    __getDBExtra(dbVersion) {
        if (dbVersion.type === 'sqlite')
            return '';

        return 'auto_increment';
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDIntValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.Int;
    }

    __getType() {
        return 'AutoIncrementId';
    }

    __escape(value) {
        js0.args(arguments, 'number');

        return String(Math.round(value));
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
module.exports = ABDAutoIncrementId;
