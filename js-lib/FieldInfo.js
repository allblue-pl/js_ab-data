'use strict';

const
    js0 = require('js0')
;

class FieldInfo {
    // static CompareDBExtra(field, dbVersion, dbExtra) {
    //     js0.args(arguments, require('./fields/ABDField'), 
    //             require('./DatabaseVersion'), 'string');
    //     return dbExtra === field.getDBExtra();
    // }

    static CompareDBType(field, dbInfo, dbType) {
        js0.args(arguments, require('./fields/ABDField'), 
                require('./DatabaseVersion'), 'string');
        return field.compareDBType(dbInfo, dbType);
    }


    constructor(name, dbType, notNull) {
        js0.args(arguments, 'string', 'string', 'boolean');

        this.name = name;
        this.dbType = dbType === null ? null : dbType.toLowerCase();
        this.notNull = notNull;
    }
}
module.exports = FieldInfo;