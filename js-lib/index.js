'use strict';

const
    js0 = require('js0'),

    DatabaseInfo = require('./DatabaseInfo')
;

class abData_Class {

    get debug() {
        return this._debug
    }

    get fields() {
        return require('./fields');
    }

    get native() {
        return require('./native');
    }

    get scheme() {
        return require('./scheme');
    }

    get validators() {
        return require('./validators');
    }

    get Device() {
        return require('./Device');
    }

    get DataStore() {
        return require('./DataStore');
    }

    get DatabaseInfo() {
        return require('./DatabaseInfo');
    }

    get Field() {
        return require('./fields/Field');
    }

    get FieldInfo() {
        return require('./FieldInfo');
    }

    get Response() {
        return require('./Response');
    }

    get RequestProcessor() {
        return require('./RequestProcessor');
    }

    get RequestProcessor_Native() {
        return require('./RequestProcessor_Native');
    }

    get RequestProcessor_Web() {
        return require('./RequestProcessor_Web');
    }

    get RTable() {
        return require('./RTable');
    }

    get SelectColumnType() {
        return require('./SelectColumnType');
    }

    get Table() {
        return require('./Table');
    }

    get TableInfo() {
        return require('./TableInfo');
    }

    get Validator() {
        return require('./Validator');
    }


    constructor() {
        this._debug = false;
    }

    error(errorTitle, error) {
        if (!this.debug)
            return;

        console.error(errorTitle, error);
    }

    setDebug(debug) {
        js0.args(arguments, 'boolean');
        this._debug = debug;
    }

}
module.exports = new abData_Class();