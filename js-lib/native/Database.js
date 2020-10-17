'use strict';

const
    abNative = require('ab-native'),
    js0 = require('js0'),

    abData = require('..'),

    DatabaseInfo = require('../DatabaseInfo'),
    FieldInfo = require('../FieldInfo'),
    TableInfo = require('../TableInfo')
;

export default class Database
{

    constructor()
    {
        let nad = new abNative.ActionsSetDef()
            .addNative('AddDBRequests', {
                requests: js0.ArrayItems(Array),
            }, {
                success: 'boolean',
                error: [ 'string', null ],
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
            .addNative('Transaction_Start', {}, null)
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
        let result = (await this.nativeActions.callNative_Async('AddDBRequests', {
            requests: requests,
                }));
        if (!result.success)
            abData.error('AddDBRequests Error', result.error);

        return result.success;

        // return (await this.nativeActions.callNative_Async('AddDBRequests', {
        //     requests: requests,
        //         })).success;
    }

    async getDBRequests_Async(requests)
    {
        let result = (await this.nativeActions.callNative_Async('GetDBRequests', {}));

        console.log(result);

        return result.rows;
    }

    async createDatabaseInfo_Async()
    {
        let databaseInfo = new DatabaseInfo();
        
        console.log(this.nativeActions)

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
                    column[1],
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

    async getNextId_Async(tableName)
    {
        js0.args(arguments, 'string');

        let nextId_Result = await this.nativeActions.callNative_Async('GetNextId', {
            tableName: tableName,
        });
        if (nextId_Result.nextId === null)
            throw new Error('Cannot get next id.');

        console.log(nextId_Result);

        return nextId_Result.nextId;
    }

    async transaction_Finish_Async(commit)
    {
        js0.args(arguments, 'boolean');

        return await this.nativeActions.callNative_Async('Transaction_Finish', 
                { commit: commit });
    }   

    async transaction_Start_Async()
    {
        return await this.nativeActions.callNative_Async('Transaction_Start', {});
    }   

    async updateScheme_Async(scheme)
    {
        js0.args(arguments, require('../scheme/DataScheme'));

        let dbInfo_Scheme = scheme.createDatabaseInfo();
        let dbInfo_DB = await this.createDatabaseInfo_Async();

        let queries = {
            create: [],
        };
        let actions = DatabaseInfo.Compare(dbInfo_Scheme, dbInfo_DB);

        for (let tableName of actions.tables.delete) {
            let query = `DROP TABLE ${tableName}`;
            
            console.log(query);
            console.log(await this.query_Execute_Async(query));
        }

        for (let tableName of actions.tables.create) {
            let tableInfo = dbInfo_Scheme.getTableInfo_ByName(tableName);
            let query = tableInfo.getQuery_Create();

            console.log(query);
            console.log(await this.query_Execute_Async(query));
        }
    }

    async query_Execute_Async(query)
    {
        return await this.nativeActions.callNative_Async('Query_Execute', 
                { query: query });
    }   

    async query_Select_Async(query, columnTypes)
    {
        return await this.nativeActions.callNative_Async('Query_Select', 
                { query: query, columnTypes: columnTypes });
    }

}
module.exports = Database;