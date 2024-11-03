'use strict';

const 
    js0 = require('js0'),

    ABDField = require('./ABDField'),

    ABDLongValidator = require('../validators/ABDLongValidator'),
    SelectColumnType = require('../SelectColumnType')
;

class ABDId extends ABDField
{

    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }
    
    getSelectType() {
        return SelectColumnType.Long;
    }

    getType() {
        return 'Id';
    }


    __getDefaultValue() {
        return 0;
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDLongValidator(fieldValidatorInfo);
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
