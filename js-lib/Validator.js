'use strict';

const
    js0 = require('js0')
;

class Validator
{

    constructor() {
        this._info =  {
            'valid': true,
            'fields': {},
            'state': '',
            'errors': [],
        };
    }

    addField(fieldName, fieldValue) {
        js0.args(arguments, 'string', null);

        this._fields_Add(fieldName, fieldValue);
    }

    addFieldValidator(fieldName, fieldValidator) {
        js0.args(arguments, 'string', require('./validators/ABDFieldValidator'));

        if (!this.hasField(fieldName))
            throw new Error(`Field '${fieldName}' does not exist.`);

        fieldValidator.validate(this, fieldName, this._info.fields[fieldName].value);
    }

    getFieldInfo(fieldName) {
        js0.args(arguments, 'string');

        if (!fieldName in this._info['fields'])
            throw new Error(`Field '${fieldName}' does not exist.`);

        return this._info['fields'][fieldName];
    }

    getInfo() {
        return this._info;
    }

    error(message) {
        js0.args(arguments, 'string');

        this._info['valid'] = false;
        this._info['errors'].push(message);
    }

    fieldError(fieldName, message) {
        js0.args(arguments, 'string', 'string');

        let field = this._fields_Get(fieldName);

        this._info['valid'] = false;
        this._info['state'] = 'error';

        field['valid'] = false;
        field['errors'].push(message);
    }

    hasField(fieldName) {
        js0.args(arguments, 'string');

        return fieldName in this._info['fields'];
    }

    isFieldValid(fieldName) {
        js0.args(arguments, 'string');

        return this.getFieldInfo(fieldName).valid;
    }

    isValid() {
        return this._info['valid'];
    }


    _fields_Add(fieldName, fieldValue) {
        js0.args(arguments, 'string', null);

        this._info['fields'][fieldName] = {
            'valid': true,
            'value': fieldValue,
            'state': '',
            'errors': [],
            'warnings': [],
            'successes': [],
        };

        return this._info['fields'][fieldName];
    }

    _fields_Get(fieldName) {
        if (!this.hasField(fieldName))
            throw new Error(`Field '${fieldName}' does not exist.`);

        return this._info.fields[fieldName];
    }

    // _fields_Exists(fieldName)
    // {
    //     return fieldName in this._info['fields'];
    // }

}
module.exports = Validator;