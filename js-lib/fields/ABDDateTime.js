const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDStringValidator = require('../validators/ABDStringValidator'),
    SelectColumnType = require('../SelectColumnType'),

    helper = require('../helper')
;

class ABDDateTime extends ABDField {
    constructor(properties = {}) {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super([], properties);
    }


    __compareDBType(dbVersion, dbType) {
        return dbType === 'datetime';
    }

    __escape(value) {
        js0.args(arguments, 'string');

        return `'` + this.__parse(value) + `'`;
    }

    __getDBType(dbVersion) {
        return 'datetime'
    }

    __getDefaultValue() {
        return '0000-00-00 00:00:00'; // length: 19
    }

    __getDBExtra() {
        return '';
    }

    __getFieldValidator(fieldValidatorInfo) {
        // if (!('maxLength' in fieldValidatorInfo))
        //     fieldValidatorInfo['maxLength'] = this.size;

        return new ABDStringValidator({ maxLength: 19 });
    }

    __getSelectType() {
        return SelectColumnType.String;
    }

    __getType() {
        return 'String';
    }

    __parse(value) {
        js0.args(arguments, 'string');

        return helper.escapeString(value);
    }

    __unescape(value) {
        return value;
    }
}
module.exports = ABDDateTime;