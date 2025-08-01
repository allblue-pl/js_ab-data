'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    SelectColumnType = require('../SelectColumnType'),

    helper = require('../helper')
;

class ABDBlob extends ABDField {

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


    __compareDBType(dbVersion, dbType) {
        if (this.type === 'tiny')
            return dbType === 'tinyblob';
        if (this.type === 'regular')
            return dbType === 'blob';
        if (this.type === 'medium')
            return dbType === 'mediumblob';

        js0.assert(false, `Unknown 'text' field type.`);
    }

    __getDBExtra() {
        return '';
    }

    __getDBType(dbVersion) {
        if (this.type === 'tiny')
            return 'tinyblob';
        if (this.type === 'regular')
            return 'blob';
        if (this.type === 'medium')
            return 'mediumblob';

        js0.assert(false, `Unknown 'text' field type.`);
    }

    __getDefaultValue() {
        return '';
    }

    __getFieldValidator(fieldValidatorInfo) {
        if (!('maxLength' in fieldValidatorInfo))
            fieldValidatorInfo['maxLength'] = this._typeSizes[this.type];

        return new ABDStringValidator(fieldValidatorInfo);
    }

    __getSelectType() {
        return SelectColumnType.String;
    }

    __getType() {
        return 'Text';
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
module.exports = ABDBlob;
