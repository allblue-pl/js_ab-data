'use strict';

const
    js0 = require('js0')
;

class DataStore
{

    constructor(requestProcessor)
    {
        js0.args(arguments, require('./RequestProcessor'));

        this._requestProcessor = requestProcessor;

        this._requests = {};
        this._tables = {};
    }

    addRequest(requestName, request)
    {
        js0.args(arguments, 'string', require('./Request'));

        if (requestName in this._requests)
            throw new Error(`Request '${requestName}' already exists.`);

        this._requests[requestName] = request;
    }

    addTable(tableName, table)
    {
        js0.args(arguments, 'string', require('./Table'));

        if (tableName in this._tables)
            throw new Error(`Table '${tableName}' already exists.`);

        this._tables[tableName] = table;
    }

    createDatabaseInfo_Async()
    {
        let databaseInfo = new DatabaseInfo();

        for (let table of this._tables) {
            let tableInfo = new TableInfo(table.name);
            for (let [ fieldName, field ] of table.columns) {
                let fieldInfo = new FieldInfo(
                    fieldName,
                    FieldInfo.GetType_FromField(field),
                    '',
                    field.properties.notNull,
                );
                tableInfo.addFieldInfo(fieldInfo);
            }
            databaseInfo.addTableInfo(tableInfo);
        }

        return databaseInfo;
    }

    updateDB_Async()
    {
        // this._requestProcessor.updateDB_Async();

        // let dbInfo_DB = await this._requestProcessor.createDatabaseInfo_Async();
        // let dbInfo_Conf = abData.DatabaseInfo.Create_FromConfig(
        //         require('./ab-data')());

        // let actions = abData.DatabaseInfo.Compare(dbInfo_Conf, dbInfo_DB);

        // for (let tableName of actions.tables.delete) {
        //     console.log('Query', `DROP TABLE ${tableName}`);
        //     let result = await this.db.query_Execute_Async(`DROP TABLE ${tableName}`);
        //     console.log(result.success, result.error);
        // }

        // for (let tableName of actions.tables.create) {
        //     let tableInfo = dbInfo_Conf.getTableInfo_ByName(tableName);

        //     console.log('Query', tableInfo.getQuery_Create());
        //     let result = await this.db.query_Execute_Async(tableInfo.getQuery_Create());
        //     console.log(result.success, result.error);
        // }
    }

}
module.exports = DataStore;