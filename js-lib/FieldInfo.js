const
    js0 = require('js0')
;

class FieldInfo {
    // static CompareDBExtra(field, dbVersion, dbExtra) {
    //     js0.args(arguments, require('./fields/ABDField'), 
    //             require('./DatabaseVersion'), 'string');
    //     return dbExtra === field.getDBExtra();
    // }

    static CompareDBType(field, dbInfo, dbType, dbExtra) {
        js0.args(arguments, require('./fields/ABDField'), 
                require('./DatabaseVersion'), 'string', 'string');
        return field.compareDBType(dbInfo, dbType, dbExtra);
    }


    constructor(name, dbType, notNull, dbExtra) {
        js0.args(arguments, 'string', 'string', 'boolean', 'string');

        this.name = name;
        this.dbType = dbType === null ? null : dbType.toLowerCase();
        this.notNull = notNull;
        this.dbExtra = dbExtra;
    }
}
module.exports = FieldInfo;