'use strict';

const
    js0 = require('js0'),

    DatabaseInfo = require('./DatabaseInfo')
;

class abData_Class
{

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

    get RequestProcessor() {
        return require('./RequestProcessor');
    }

    get RequestProcessor_Native() {
        return require('./RequestProcessor_Native');
    }

    get RequestProcessor_Web() {
        return require('./RequestProcessor_Web');
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


    constructor()
    {
        this._debug = false;
    }

    error(errorTitle, error)
    {
        if (!this.debug)
            return;

        console.error(errorTitle, error);
    }

    setDebug(debug)
    {
        js0.args(arguments, 'boolean');
        this._debug = debug;
    }

    // async execAsync(fsPath)
    // {
    //     let dbInfo_Config = DatabaseInfo.CreateFrom_Config(require(path.resolve(fsPath))());

    //     let db = abMysql.connect({
    //         host: 'localhost',
    //         database: 'alta-associations',
    //         user: 'root',
    //         password: '',
    //     });

    //     let dbInfo_MySQL = await DatabaseInfo.CreateFrom_DB_Async(db);

    //     let queries = {
    //         create: [],
    //     };

    //     dbInfo_MySQL.compare(dbInfo_Config, queries);

    //     for (let query of queries.create) {
    //         console.log(query);
    //         console.log(await db.query_ExecuteAsync(query));
    //     }

    //     db.disconnect();

    //     // let dbInfo_MySQL = await DatabaseInfo.CreateFrom_DB_Async({
    //     //     connection: {
    //     //         host: 'localhost',
    //     //         database: 'alta-associations',
    //     //         user: 'root',
    //     //         password: '',
    //     //     },
    //     // });

    //     return;
    // }

}
module.exports = new abData_Class();