'use strict';

const
    abLock = require('ab-lock'),
    abNative = require('ab-native'),
    js0 = require('js0'),

    abData = require('..'),
    helper = require('../helper'),

    DatabaseInfo = require('../DatabaseInfo'),
    FieldInfo = require('../FieldInfo'),
    TableInfo = require('../TableInfo'),

    ABDDatabaseError = require('./ABDDatabaseError')
;

class Database
{

    static EscapeString(str)
    {
        return helper.escapeString(str);
    }

    static UnescapeString(str)
    {
        return helper.unescapeString(str);
    }

    static Quote(str)
    {
        return helper.quote(str);
    }


    constructor()
    {
        this._initialized = false;
        this._lastError = null;

        let nad = new abNative.ActionsSetDef()
            .addNative('GetAffectedRows', {

            }, {
                affectedRows: [ 'int', js0.Null ],
            })
            .addNative('GetTableNames', {

            }, {
                tableNames: js0.Iterable('string'),
                error: [ 'string', js0.Null ],
            })
            .addNative('GetTableColumns', {
                tableName: [ 'string' ],
            }, {
                columns: js0.Iterable(null),
                error: [ 'string', js0.Null ],
            })
            .addNative('Transaction_Finish', {
                commit: 'boolean',
            }, {
                success: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .addNative('Transaction_IsAutocommit', {
             
            }, {
                result: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .addNative('Transaction_Start', {}, {
                success: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .addNative('Query_Execute', {
                query: 'string',
            }, {
                success: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .addNative('Query_Select', {
                query: 'string',
                columnTypes: js0.Iterable('string'),
            }, {
                rows: [ Array, js0.Null ],
                error: [ 'string', js0.Null ],
            });
        this.nativeActions = abNative.addActionsSet('ABDatabase', nad);
    }

    

    // async clearDBRequests_Async(requestIds)
    // {
    //     js0.args(arguments, Array);

    //     await this.query_Execute_Async(
    //             `DELETE FROM _ABData_DBRequests ` +
    //             ` WHERE Id IN (` + requestIds.join(',') + `)`);
    // }

    // async deleteDBRequests_ByIds_Async(ids)
    // {
    //     js0.args(arguments, js0.ArrayItems('number'));

    //     await this.query_Execute_Async(
    //             `DELETE FROM _ABData_DBRequests` +
    //             ` WHERE Id IN (` + ids.join(',') + `)`);
    // }

    // async getDBRequests_ByType_Async(requestName, actionName)
    // {
    //     js0.args(arguments, 'string', 'string');

    //     let rows = await this.query_Select_Async(
    //             `SELECT Id, RequestName, ActionName, ActionArgs` +
    //             ` FROM _ABData_DBRequests` +
    //             ` WHERE RequestName = '${requestName}' AND ActionName = '${actionName}'` +
    //             ` ORDER BY Id`,
    //             [ 'Long', 'String', 'String', 'String' ]);

    //     for (let row of rows)
    //         row[3] = JSON.parse(row[3]);

    //     return rows;
    // }

    // async getDBRequests_ForSync_Async()
    // {
    //     let rows = await this.query_Select_Async(
    //             `SELECT Id, RequestName, ActionName, ActionArgs` +
    //             ` FROM _ABData_DBRequests ORDER BY Id`, 
    //             [ 'Long', 'String', 'String', 'String' ]);

    //     for (let row of rows)
    //         row[3] = JSON.parse(row[3]);

    //     return rows;
    // }

    // async getVersion_Async()
    // {
    //     let version = null;
    //     try {
    //         let version_Rows = await this.query_Select_Async(
    //                 `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'version'`, 
    //                 [ 'String', 'String' ]);
    //         if (version_Rows.length !== 0)
    //             version = JSON.parse(version_Rows[0][1])['value'];
    //     } catch (e) {
    //         if (e instanceof ABDDatabaseError) {
    //             // Table does not exist.
    //         } else 
    //             throw e;
    //     }

    //     return version;
    // }

    async checkInit_Async()
    {
        if (!this._initialized)
            throw new Error('Database not initialized.');
    }

    async createDatabaseInfo_Async()
    {
        await this.checkInit_Async();

        let databaseInfo = new DatabaseInfo();

        let tableNames = (await this.nativeActions.callNative_Async('GetTableNames'))
                .tableNames;
        for (let tableName of tableNames) {
            let tableInfo = new TableInfo(tableName);

            let result = await this.nativeActions.callNative_Async('GetTableColumns', {
                tableName: tableName,
            });
            for (let column of result.columns) {
                tableInfo.addFieldInfo(new FieldInfo(
                    column[0],
                    null,
                    [ column[1] ],
                    '',
                    column[2] === 1,
                ));
            }

            databaseInfo.addTableInfo(tableInfo);
        }
        
        return databaseInfo;
    }

    getLastError()
    {
        return this._lastError;
    }

    async init_Async()
    {
        if (this._initialized)
            throw new Error('Database already initialized.');

        let isAutocommit_Result = await this.nativeActions.callNative_Async(
                'Transaction_IsAutocommit', {});

        if (!isAutocommit_Result.result) {
            let finish_Result = await this.nativeActions.callNative_Async('Transaction_Finish', 
                    { commit: false });

            console.log(finish_Result);

            if (!finish_Result.success)
                throw new Error('Cannot initialize Database.');
        }

        this._initialized = true;
    }

    async transaction_Finish_Async(commit)
    {
        js0.args(arguments, 'boolean');

        await this.checkInit_Async();

        // console.log('End', new Error());

        let result = await this.nativeActions.callNative_Async('Transaction_Finish', 
                { commit: commit });

        if (!result.success)
            throw new ABDDatabaseError(result.error);
    }   

    async transaction_IsAutocommit_Async()
    {
        await this.checkInit_Async();

        let result = await this.nativeActions.callNative_Async('Transaction_IsAutocommit', {});
        return result.result;
    }

    async transaction_Start_Async()
    {
        await this.checkInit_Async();

        let result = await this.nativeActions.callNative_Async('Transaction_Start', {});
        if (!result.success)
            throw new ABDDatabaseError(result.error);
    }   

    async transaction_StartLocal_Async()
    {
        await this.checkInit_Async();

        let localTransaction = false;
        await abLock.sync(this, async () => {
            if (await this.transaction_IsAutocommit_Async()) {
                localTransaction = true;
                await this.transaction_Start_Async();
            }
        });

        return localTransaction;
    }

    async query_Execute_Async(query)
    {
        await this.checkInit_Async();

        let result = await this.nativeActions.callNative_Async('Query_Execute', 
                { query: query });

        if (!result.success)
            throw new ABDDatabaseError(result.error);
    }   

    async query_Select_Async(query, columnTypes)
    {
        await this.checkInit_Async();

        let result = await this.nativeActions.callNative_Async('Query_Select', 
                { query: query, columnTypes: columnTypes });

        if (result.rows === null)
            throw new ABDDatabaseError(result.error);

        return result.rows;
    }

}
module.exports = Database;