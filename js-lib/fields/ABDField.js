'use strict';

const
    js0 = require('js0'),

    SelectColumnType = require('../SelectColumnType')
;

class ABDField {
    get args() {
        return this._args;
    }

    get defaultValue() {
        return this._properties.defaultValue === js0.NotSet ? 
                (this._properties.notNull ? this.__getDefaultValue() : null) :
                this._properties.defaultValue;
    }

    get notNull() {
        return this._properties.notNull;
    }

    get properties() {
        return this._properties;
    }


    constructor(args, properties) {
        js0.args(arguments, Array, js0.RawObject);
        js0.typeE(properties, js0.Preset({
            notNull: [ 'boolean', js0.Default(false) ],
            defaultValue: [ null, js0.Default(js0.NotSet) ],
        }));

        this._args = args;
        this._properties = properties;
    }

    compareDBType(dbVersion, dbType, dbExtra) {
        js0.args(arguments, require('../DatabaseVersion'), 'string', 'string');
        return js0.rtn('boolean', this.__compareDBType(dbVersion, dbType, dbExtra));
    }

    getDBType(dbVersion) {
        js0.args(arguments, require('../DatabaseVersion'));
        return js0.rtn('string', this.__getDBType(dbVersion));
    }

    getDBExtra(dbVersion) {
        js0.args(arguments, require('../DatabaseVersion'));
        return js0.rtn('string', this.__getDBExtra(dbVersion));
    }

    getSelectType() {
        return js0.rtn(js0.Enum(SelectColumnType.$Values), 
                this.__getSelectType());
    }

    getQuery_Column(dbVersion, columnName) {
        js0.args(arguments, require('../DatabaseVersion'), 'string');

        let dbExtra = this.getDBExtra(dbVersion);
        return `${columnName} ` + this.getDBType(dbVersion) + (this.notNull ? 
                ' NOT NULL' : ' NULL') + (dbExtra === '' ? '' : ` ${dbExtra}`);
    }

    escape(value) {
        js0.args(arguments, null);

        if (value === null)
            return 'NULL';

        return js0.rtn('string', this.__escape(value));
    }

    escapeArray(arr) {
        js0.args(arguments, Array);

        let arr_Escaped = [];
        for (let val of arr)
            arr_Escaped.push(this.escape(val));

        return '(' + arr_Escaped.join(',') + ')';
    }

    getFieldValidator(fieldValidatorInfo) {
        js0.args(arguments, js0.RawObject);

        if (!('notNull' in fieldValidatorInfo))
            fieldValidatorInfo['notNull'] = this.properties['notNull'];

        return js0.rtn(require('../validators/ABDFieldValidator'),
                this.__getFieldValidator(fieldValidatorInfo));
    }

    parse(value) {
        if (value === null)
            return null;

        return this.__parse(value);
    }

    unescape(value) {
        if (value === null)
            return null;

        return this.__unescape(value);
    }


    __unescape(value) { 
        return value;
    }
    

    __compareDBType(dbVersion, dbType, dbExtra) { js0.virtual(this); }
    __getDBExtra(dbVersion) { js0.virtual(this); }
    __getDBType(dbVersion) { js0.virtual(this); }
    __getDefaultValue() { js0.virtual(this); }
    __getFieldValidator(fieldValidatorInfo) { js0.virtual(this); }
    __getSelectType() { js0.virtual(this); }
    __getType(dbVersion) { js0.virtual(this); }
    __escape(value) { js0.virtual(this); }
    __parse(value) { js0.virtual(this); }

}
module.exports = ABDField;
