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
        this._lastError = null;

        let nad = new abNative.ActionsSetDef()
            .addNative('AddDBRequests', {
                requests: js0.ArrayItems(Array),
            }, {
                success: 'boolean',
                error: [ 'string', null ],
            })
            .addNative('GetAffectedRows', {

            }, {
                affectedRows: [ 'int', js0.Null ],
            })
            .addNative('GetDBRequests', {

            }, {
                rows: [ Array, null ],
                error: [ 'string', null ],
            })
            .addNative('GetDeviceInfo', {
                
            }, {
                deviceId: [ js0.Long, js0.Null ],
                deviceHash: [ 'string', js0.Null ],
                lastUpdate: [ js0.Long, js0.Null ],
            })
            .addNative('GetNextId', {
                tableName: 'string',
            }, {
                nextId: js0.Long,
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
            .addNative('SetDeviceInfo', {
                deviceId: [ js0.Long, js0.Default(null) ],
                deviceHash: [ 'string', js0.Default(null) ],
                lastUpdate: [ js0.Long, js0.Default(null) ],
            }, {

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
                rows: Array,
                error: [ 'string', js0.Null ],
            });
        this.nativeActions = abNative.addActionsSet('ABDatabase', nad);
    }

    async addDBRequests_Async(requests)
    {
        js0.args(arguments, Array);

        let localTransaction = await this.transaction_StartLocal_Async();

        let nextRequestId = 1;
        let nextRequestId_Rows = await this.query_Select_Async(
                `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'nextRequestId'`, 
                [ 'String', 'String' ]);
        if (nextRequestId_Rows.length !== 0)
            nextRequestId = JSON.parse(nextRequestId_Rows[0][1])['value'];

        let query = `INSERT INTO _ABData_DBRequests ` +
                `(Id, RequestName, ActionName, ActionArgs)` +
                ` VALUES `;

        let requests_DB = [];
        for (let request of requests) {
            query += `(`;
            query += ++nextRequestId + `, `;
            query += `'` + request[0] + `', `;
            query += `'` + request[1] + `', `;
            query += `'` + Database.EscapeString(JSON.stringify(request[2])) + `'`;
            query += `)`;
        }

        await this.query_Execute_Async(query);

        let nextRequestId_JSON_Str = JSON.stringify({ value: nextRequestId });
        if (nextRequestId_Rows.length === 0) {
            await this.query_Execute_Async(
                    `INSERT INTO _ABData_Settings (Name, Data)` + 
                    ` VALUES('nextRequestId', '${nextRequestId_JSON_Str}')`);
        } else {
            await this.query_Execute_Async(
                    `UPDATE _ABData_Settings` + 
                    ` SET Name = 'nextRequestId', Data = '${nextRequestId_JSON_Str}'` + 
                    ` WHERE Name = 'nextRequestId'`);
        }

        if (localTransaction)
            await this.transaction_Finish_Async(true);

        // return (await this.nativeActions.callNative_Async('AddDBRequests', {
        //     requests: requests,
        //         })).success;
    }

    async clearDBRequests_Async(requestIds)
    {
        js0.args(arguments, Array);

        await this.query_Execute_Async(
                `DELETE FROM _ABData_DBRequests ` +
                ` WHERE Id IN (` + requestIds.join(',') + `)`);
    }

    async deleteDBRequests_ByIds_Async(ids)
    {
        js0.args(arguments, js0.ArrayItems('number'));

        await this.query_Execute_Async(
                `DELETE FROM _ABData_DBRequests` +
                ` WHERE Id IN (` + ids.join(',') + `)`);
    }

    async getDBRequests_ByType_Async(requestName, actionName)
    {
        js0.args(arguments, 'string', 'string');

        let rows = await this.query_Select_Async(
                `SELECT Id, RequestName, ActionName, ActionArgs` +
                ` FROM _ABData_DBRequests` +
                ` WHERE RequestName = '${requestName}' AND ActionName = '${actionName}'` +
                ` ORDER BY Id`,
                [ 'Long', 'String', 'String', 'String' ]);

        for (let row of rows)
            row[3] = JSON.parse(row[3]);

        return rows;
    }

    async getDBRequests_ForSync_Async()
    {
        let rows = await this.query_Select_Async(
                `SELECT Id, RequestName, ActionName, ActionArgs` +
                ` FROM _ABData_DBRequests ORDER BY Id`, 
                [ 'Long', 'String', 'String', 'String' ]);

        for (let row of rows)
            row[3] = JSON.parse(row[3]);

        return rows;
    }

    async createDatabaseInfo_Async()
    {
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

    async clearRequests_Async(requestInfos)
    {

    }

    getLastError()
    {
        return this._lastError;
    }

    async getNextId_Async(tableName)
    {
        js0.args(arguments, 'string');

        let nextId_Result = await this.nativeActions.callNative_Async('GetNextId', {
            tableName: tableName,
        });
        if (nextId_Result.nextId === null)
            throw new Error('Cannot get next id.');

        return nextId_Result.nextId;
    }

    async transaction_Finish_Async(commit)
    {
        js0.args(arguments, 'boolean');

        // console.log('End', new Error());

        let result = await this.nativeActions.callNative_Async('Transaction_Finish', 
                { commit: commit });

        if (!result.success)
            throw new ABDDatabaseError(result.error);
    }   

    async transaction_IsAutocommit_Async()
    {
        let result = await this.nativeActions.callNative_Async('Transaction_IsAutocommit', {});
        return result.result;
    }

    async transaction_Start_Async()
    {
        let result = await this.nativeActions.callNative_Async('Transaction_Start', {});
        if (!result.success)
            throw new ABDDatabaseError(result.error);
    }   

    async transaction_StartLocal_Async()
    {
        let localTransaction = false;
        await abLock.sync(this, async () => {
            if (await this.transaction_IsAutocommit_Async()) {
                localTransaction = true;
                await this.transaction_Start_Async();
            }
        });

        return localTransaction;
    }

    async updateScheme_Async(scheme)
    {
        js0.args(arguments, require('../scheme/DataScheme'));

        let dbInfo_Scheme = scheme.createDatabaseInfo();
        let dbInfo_DB = await this.createDatabaseInfo_Async();

        let queries = {
            create: [],
        };
        let actions = DatabaseInfo.Compare(scheme, dbInfo_Scheme, dbInfo_DB);

        for (let tableInfo of actions.tables.delete) {
            let query = `DROP TABLE ${tableInfo.name}`;
            
            console.log(query);
            await this.query_Execute_Async(query);
        }

        for (let tableInfo of actions.tables.create) {
            let query = tableInfo.getQuery_Create();

            console.log(query);
            await this.query_Execute_Async(query);
        }

        for (let alterInfo of actions.tables.alter) {
            for (let fieldInfo of alterInfo.delete) {
                let query_Alter = `ALTER TABLE ${alterInfo.tableInfo.name}` +
                        ` DROP COLUMN \`${fieldInfo.name}\``;
                let result = await this.query_Execute_Async(query_Alter);
            }
            
            for (let fieldInfo of alterInfo.create) {
                let query_Alter = `ALTER TABLE ${alterInfo.tableInfo.name}` +
                        ` ADD COLUMN ` + fieldInfo.getQuery_Column();
                // let query_Clean = null;

                if (fieldInfo.notNull) {
                    query_Alter += ' DEFAULT ' + fieldInfo.field.escape(
                            fieldInfo.field.defaultValue);
                    // query_Clean = `ALTER TABLE ${alterInfo.tableInfo.name}` +
                    //         ` ALTER COLUMN ` + fieldInfo.name + 
                    //         ` DROP DEFAULT`;
                }
                
                console.log(query_Alter);
                // console.log(query_Clean);

                let result = await this.query_Execute_Async(query_Alter);
                // if (query_Clean !== null)
                //     result = await this.query_Execute_Async(query_Clean);
            }

           console.log(`Altered: alterInfo.tableInfo.name`);
            if (alterInfo.delete.length > 0) {
               console.log('  deleted:');
                for (let fieldInfo of alterInfo.delete)
                   console.log(`    - ${fieldInfo.name}`);
            }
            if (alterInfo.create.length > 0) {
               console.log('  created:');
                for (let fieldInfo of alterInfo.create)
                   console.log(`    - ${fieldInfo.name}`);
            }
        }
    }

    async query_Execute_Async(query)
    {
        let result = await this.nativeActions.callNative_Async('Query_Execute', 
                { query: query });

        if (!result.success)
            throw new ABDDatabaseError(result.error);
    }   

    async query_Select_Async(query, columnTypes)
    {
        let result = await this.nativeActions.callNative_Async('Query_Select', 
                { query: query, columnTypes: columnTypes });

        if (result.rows === null)
            throw new ABDDatabaseError(result.error);

        return result.rows;
    }

}
module.exports = Database;