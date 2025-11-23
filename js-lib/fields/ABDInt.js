'use strict';

const 
    js0 = require('js0'),

    ABDField = require('./ABDField'),

    ABDIntValidator = require('../validators/ABDIntValidator'),
    SelectColumnType = require('../SelectColumnType')
;


class ABDInt extends ABDField {
    get unsigned() {
        return this._unsigned;
    }

    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);

        let unsigned = false;
        if ('unsigned' in properties) {
            js0.typeE(properties.unsigned, 'boolean');
            unsigned = properties.unsigned;
            delete properties.unsigned;
        }

        super([ unsigned ], properties);

        this._unsigned = unsigned;
    }


    __getDBExtra(dbVersion) {
        return '';
    }

    __getDBType(dbVersion) {
        if (dbVersion.type === 'mysql')
            return 'int' + (this.unsigned ? ' unsigned' : '');

        return 'int';
    }

    __compareDBType(dbVersion, dbType) {
        let unsigned = this.unsigned ? ' unsigned' : '';
        return [ `int${unsigned}`, `int(11)${unsigned}` ].includes(dbType);
    }

    __getDefaultValue() {
        return 0;
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDIntValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.Int;
    }

    __getType() {
        return 'Int';
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
