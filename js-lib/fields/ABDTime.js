'use strict';

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

    getSelectType() {
        return SelectColumnType.Long;
    }

    getType() {
        return 'Time';
    }


    __getDefaultValue() {
        return 0;
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDTimeValidator(fieldValidatorInfo);
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
        return Number(value);
    }

}
module.exports = ABDTime;
