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

    get type() {
        return this._type;
    }

    get _typeSizes() {
        return {
            tiny:       256,
            regular:    65535,
            medium:     16777215,
        };
    }

    constructor(type, properties = {}) {
        js0.args(arguments, js0.Enum([ 'tiny', 'regular', 'medium' ]), 
                [ js0.RawObject, js0.Default ]);

        super([ type ], properties);

        this._type = type;
    }

    getSelectType() {
        return SelectColumnType.String;
    }

    getType() {
        return 'Text';
    }


    __getDefaultValue() {
        return '';
    }

    __getFieldValidator(fieldValidatorInfo) {
        if (!('maxLength' in fieldValidatorInfo))
            fieldValidatorInfo['maxLength'] = this._typeSizes[this.type];

        return new ABDStringValidator(fieldValidatorInfo);
    }

    __escape(value) {
        js0.args(arguments, 'string');

        return `'` + helper.escapeString(value) + `'`;
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
