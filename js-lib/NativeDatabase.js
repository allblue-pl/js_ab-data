'use strict';

const
    abData = require('ab-data'),
    abNative = require('ab-native'),
    js0 = require('js0')
;

export default class NativeDatabase
{

    static EscapeString(str)
    {
        return str.replace(/[\0\n\r\b\t\\'"\x1a]/g, (c) => {
            switch (c) {
                case "\0":
                    return "\\0";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\b":
                    return "\\b";
                case "\t":
                    return "\\t";
                case "\x1a":
                    return "\\Z";
                case "'":
                    return "''";
                case '"':
                    return '""';
                default:
                    return "\\" + s;
            }
        });
    }

    static Quote(str)
    {
        return str
            .replace(/\\/g, "\\\\")
            .replace(/\'/g, "\\\'")
            .replace(/\"/g, "\\\"")
            .replace(/\n/g, "\\\n")
            .replace(/\r/g, "\\\r")
            .replace(/\x00/g, "\\\x00")
            .replace(/\x1a/g, "\\\x1a");
    }


    constructor()
    {
        this.nativeActions = new abNative.ActionsSet('ABDatabase')
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
                deviceId: js0.Long,
                deviceHash: 'string',
            }, {
                success: 'boolean',
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
    }

    async createDatabaseInfo_Async()
    {
        let databaseInfo = new abData.DatabaseInfo();
        
        let tableNames = (await this.nativeActions.callNative_Async('GetTableNames'))
                .tableNames;
        for (let tableName of tableNames) {
            let tableInfo = new abData.TableInfo(tableName);

            let result = await this.nativeActions.callNative_Async('GetTableColumns', {
                tableName: tableName,
            });
            for (let column of result.columns) {
                tableInfo.addFieldInfo(new abData.FieldInfo(
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