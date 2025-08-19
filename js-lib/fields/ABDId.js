const 
    js0 = require('js0'),

    ABDField = require('./ABDField'),

    ABDLongValidator = require('../validators/ABDLongValidator'),
    SelectColumnType = require('../SelectColumnType')
;

class ABDId extends ABDField {

    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }


    __compareDBType(dbVersion, dbType) {
        return [ 'bigint', 'bigint(20)' ].includes(dbType);
    }

    __getDBExtra() {
        return '';
    }

    __getDBType(dbVersion) {
        return 'bigint';
    }

    __getDefaultValue() {
        return 0;
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDLongValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.Long;
    }

    __getType() {
        return 'Id';
    }

    __escape(value) {
        js0.args(arguments, js0.Long);

        return String(this.__parse(value));
    }

    __parse(value) {
        js0.args(arguments, js0.Long);

        return value;
    }

    __unescape(value) {
        return Number(value);
    }

}
module.exports = ABDId;