const
    js0 = require('js0'),

    DatabaseInfo = require('./DatabaseInfo')
;

class abData_Class {

    get debug() {
        return this._debug;
    }

    get fields() {
        return require('./fields');
    }

    get validators() {
        return require('./validators');
    }

    get ABDField() {
        return require('./fields/ABDField');
    }

    get Device() {
        return require('./Device');
    }

    get DataScheme() {
        return require('./DataScheme');
    }

    get DataStore() {
        return require('./DataStore');
    }

    get DatabaseInfo() {
        return require('./DatabaseInfo');
    }

    get DatabaseVersion() {
        return require('./DatabaseVersion');
    }

    get Field() {
        return require('./fields/Field');
    }

    get FieldInfo() {
        return require('./FieldInfo');
    }

    get IndexInfo() {
        return require('./IndexInfo');
    }

    get Response() {
        return require('./Response');
    }

    get RequestDef() {
        return require('./RequestDef');
    }

    get RequestProcessor() {
        return require('./RequestProcessor');
    }

    get RTableDef() {
        return require('./RTableDef');
    }

    get SelectColumnType() {
        return require('./SelectColumnType');
    }

    get TableDef() {
        return require('./TableDef');
    }

    get TableInfo() {
        return require('./TableInfo');
    }

    get TableRequestDef() {
        return require('./TableRequestDef');
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