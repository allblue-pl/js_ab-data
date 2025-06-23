'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDJSONValidator = require('../validators/ABDJSONValidator'),
    SelectColumnType = require('../SelectColumnType'),

    helper = require('../helper')
;

class ABDJSON extends ABDField {

    get size() {
        return this._size;
    }

    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }

    getSelectType() {
        return SelectColumnType.JSON;
    }

    getType() {
        return 'JSON';
    }


    __getDefaultValue() {
        return null;
    }

    __getFieldValidator(fieldValidatorInfo) {
        return new ABDJSONValidator(fieldValidatorInfo);
    }

    __escape(value) {
        js0.args(arguments, js0.RawObject);

        return `'` + this.__parse(value) + `'`;
    }

    __parse(value) {
        js0.args(arguments, js0.RawObject);

        let jsonValue = value.value;

        return helper.escapeString(JSON.stringify({ value: jsonValue, }));
    }

    __unescape(value) {
        return value;
    }

}
module.exports = ABDJSON;