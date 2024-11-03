'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDStringValidator = require('../validators/ABDStringValidator'),
    SelectColumnType = require('../SelectColumnType'),

    helper = require('../helper')
;

class ABDString extends ABDField
{

    get size() {
        return this._size;
    }

    constructor(size, properties = {}) {
        js0.args(arguments, js0.Int, [ js0.RawObject, js0.Default ]);

        super([ size ], properties);

        this._size = size;
    }

    getSelectType() {
        return SelectColumnType.String;
    }

    getType() {
        return 'String';
    }


    __getDefaultValue() {
        return '';
    }

    __getFieldValidator(fieldValidatorInfo) {
        if (!('maxLength' in fieldValidatorInfo))
            fieldValidatorInfo['maxLength'] = this.size;

        return new ABDStringValidator(fieldValidatorInfo);
    }

    __escape(value) {
        js0.args(arguments, 'string');

        return `'` + this.__parse(value) + `'`;
    }

    __parse(value) {
        js0.args(arguments, 'string');

        return helper.escapeString(value);
    }

    __unescape(value) {
        return value;
    }

}
module.exports = ABDString;
