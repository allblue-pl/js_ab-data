const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDTimeValidator = require('../validators/ABDTimeValidator'),
    SelectColumnType = require('../SelectColumnType')
;

class ABDTime extends ABDField {

    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }


    __compareDBType(dbVersion, dbType) {
        return [ 'bigint', 'bigint(20)' ].includes(dbType);
    }

    __getDBType(dbVersion) {
        return 'bigint';
    }

    __getDefaultValue() {
        return 0;
    }

    __getDBExtra() {
        return '';
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDTimeValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.Long;
    }

    __getType() {
        return 'Time';
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
        return Number(value);
    }

}
module.exports = ABDTime;