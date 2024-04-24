'use strict';

const
    abData = require('ab-data'),
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    DataStore = require('../DataStore'),
    DatabaseInfo = require('../DatabaseInfo'),
    Response = require('../Response'),

    Database = require('./Database')
;

class NativeDataStore extends DataStore
{

    static async GetDeviceInfo_Async(db, transactionId = null)
    {
        js0.args(arguments, abData.native.Database, [ 'int', js0.Null, 
                js0.Default ]);

        let rows = await db.query_Select_Async(
                `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'deviceInfo'`, 
                [ 'String', 'String' ], transactionId);

        if (rows.length === 0)
            return null;

        let deviceInfo = JSON.parse(rows[0][1])['value'];
        
        return deviceInfo;
    }

    static async GetDBSchemeVersion_Async(db, transactionId = null)
    {
        js0.args(arguments, abData.native.Database, [ 'int', js0.Null,
                js0.Default ]);
        let version = null;
        try {
            let version_Rows = await db.query_Select_Async(
                    `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'version'`, 
                    [ 'String', 'String' ], transactionId);
            if (version_Rows.length !== 0) {
                try {
                    version = JSON.parse(version_Rows[0][1])['value'];
                } catch (e) {
                    if (abData.debug)
                        console.log(GetDBSchemeVersion, e);
                    
                    if (e.name === 'SyntaxError') {
                        console.error("Cannot parse DB scheme version.");
                        return -1;
                    }
                }
            }
        } catch (e) {
            if (abData.debug)
                console.log('GetDBSchemeVersion', e);

            if (e instanceof require('./ABDDatabaseError')) {
                return -1
            } else 
                throw e;
        }

        return version;
    }

    static async InitDeviceInfo_Async(db, transactionId = null)
    {
        js0.args(arguments, abData.native.Database, [ 'int', js0.Null, 
                js0.Default ]);

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(db, 
                transactionId);
        if (deviceInfo === null)
            return null;

        deviceInfo.declaredItemIds = [];
        deviceInfo.usedItemIds = [];
        
        return deviceInfo;
    }

    static async ResetDeviceLastUpdate_Async(db, transactionId = null)
    {
        js0.args(arguments, abData.native.Database, [ 'int', js0.Null, 
                js0.Default ]);

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await db.transaction_Start_Async();
            localTransaction = true;
        }

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(db, 
                transactionId);
        if (deviceInfo === null)
            return;

        deviceInfo.lastUpdate = null;
        await NativeDataStore.SetDeviceInfo_Async(db, deviceInfo.deviceId,
                deviceInfo.deviceHash, deviceInfo.lastItemId, 
                deviceInfo.lastUpdate, deviceInfo.declaredItemIds, 
                transactionId);

        if (localTransaction)
            await db.transaction_Finish_Async(true, transactionId);
    }

    static async SetDeviceInfo_Async(db, deviceId, deviceHash, lastItemId, 
            lastUpdate, declaredItemIds, transactionId = null)
    {
        js0.args(arguments, abData.native.Database, js0.Long, 'string', js0.Long, 
                [ js0.Long, js0.Null ], Array, [ 'int', js0.Null, js0.Default ]);

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await db.transaction_Start_Async();
            localTransaction = true;
        }

        let deviceInfo_Old = await NativeDataStore.GetDeviceInfo_Async(db, 
                transactionId);
        let deviceInfo = {
            deviceId: deviceId,
            deviceHash: deviceHash,
            lastItemId: lastItemId,
            lastUpdate: lastUpdate,
            declaredItemIds: declaredItemIds,
        };
        let deviceInfo_JSON_Str = abData.native.Database.EscapeString(
                JSON.stringify({ value: deviceInfo, }));
            
        if (deviceInfo_Old === null) {
            await db.query_Execute_Async(
                `INSERT INTO _ABData_Settings (Name, Data)` + 
                ` VALUES('deviceInfo', '${deviceInfo_JSON_Str}')`, transactionId);
        } else {
            await db.query_Execute_Async(
                `UPDATE _ABData_Settings` + 
                ` SET Name = 'deviceInfo', Data = '${deviceInfo_JSON_Str}'` + 
                ` WHERE Name = 'deviceInfo'`, transactionId);
        }

        if (localTransaction)
            await db.transaction_Finish_Async(true, transactionId);
    }

    static async SetDBSchemeVersion_Async(db, version, transactionId = null)
    {
        js0.args(arguments, abData.native.Database, 'int', [ 'int', js0.Null, 
                js0.Default ]);

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await db.transaction_Start_Async();
            localTransaction = true;
        }

        let version_Old = await NativeDataStore.GetDBSchemeVersion_Async(db, 
                transactionId);

        let version_JSON_Str = JSON.stringify({ value: version, });
        if (version_Old === null) {
            await db.query_Execute_Async(
                    `INSERT INTO _ABData_Settings (Name, Data)` + 
                    ` VALUES('version', '${version_JSON_Str}')`, transactionId);
        } else {
            await db.query_Execute_Async(
                    `UPDATE _ABData_Settings` + 
                    ` SET Name = 'version', Data = '${version_JSON_Str}'` + 
                    ` WHERE Name = 'version'`, transactionId);
        }

        if (localTransaction)
            await db.transaction_Finish_Async(true, transactionId);

        return version;
    }

    static async UpdateDBScheme_Async(db, scheme, transactionId = null)
    {
        js0.args(arguments, require('./Database'), 
                require('../scheme/DataScheme'), [ 'int', js0.Null, 
                js0.Default ]);

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await db.transaction_Start_Async();
            localTransaction = true;
        }

        let dbInfo_Scheme = scheme.createDatabaseInfo();
        let dbInfo_DB = await db.createDatabaseInfo_Async();

        let actions = DatabaseInfo.Compare(scheme, dbInfo_Scheme, dbInfo_DB);

        for (let tableInfo of actions.tables.delete) {
            let query = `DROP TABLE ${tableInfo.name}`;
            await db.query_Execute_Async(query, transactionId);
        }

        for (let tableInfo of actions.tables.create) {
            let query = tableInfo.getQuery_Create();

            console.log(query);
            await db.query_Execute_Async(query, transactionId);
        }

        for (let alterInfo of actions.tables.alter) {
            for (let fieldInfo of alterInfo.delete) {
                let query_Alter = `ALTER TABLE ${alterInfo.tableInfo.name}` +
                        ` DROP COLUMN \`${fieldInfo.name}\``;
                let result = await db.query_Execute_Async(query_Alter, 
                        transactionId);
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

                let result = await db.query_Execute_Async(query_Alter, 
                        transactionId);
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

        await NativeDataStore.SetDBSchemeVersion_Async(db, scheme.version, 
                transactionId);

        if (localTransaction)
            await db.transaction_Finish_Async(true, transactionId);

        return actions;
    }


    get scheme() {
        return this._scheme;
    }

    get db() {
        return this._db;
    }

    get device() {
        return this._device;
    }


    constructor(requestProcessor, apiUri)
    {
        js0.args(arguments, require('../RequestProcessor_Native'), 'string');

        super(requestProcessor);

        this._scheme = requestProcessor.scheme;
        this._db = requestProcessor.db;
        this._device = requestProcessor.device;

        this._apiUri = apiUri;

        this._requests = {};
        this._listeners_OnDBSync = [];
    }

    async addDeviceDeletedRows_Async(rDeviceDeletedRows, transactionId = null)
    {
        js0.args(arguments, Array, [ 'int', js0.Null ]);

        await this._scheme.getTable('_ABData_DeviceDeletedRows').update_Async(
                this._db, rDeviceDeletedRows, transactionId);
    }

    async addDBRequest_Async(requestName, actionName, actionArgs, 
            transactionId = null)
    {
        js0.args(arguments, 'string', 'string', js0.RawObject, [ 'int', 
                js0.Null, js0.Default ]);

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await this.db.transaction_Start_Async();
            localTransaction = true;
        }

        let nextRequestId = 1;
        let nextRequestId_Rows = await this.db.query_Select_Async(
                `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'nextRequestId'`, 
                [ 'String', 'String' ], transactionId);
        if (nextRequestId_Rows.length !== 0)
            nextRequestId = JSON.parse(nextRequestId_Rows[0][1])['value'];

        let query = `INSERT INTO _ABData_DBRequests ` +
                `(Id, RequestName, ActionName, ActionArgs, SchemeVersion)` +
                ` VALUES `;

        query += `(`;
        query += ++nextRequestId + `,`;
        query += `'` + requestName + `',`;
        query += `'` + actionName + `',`;
        query += `'` + Database.EscapeString(JSON.stringify(actionArgs)) + `',`;
        query += this.scheme.version;
        query += `)`;

        await this.db.query_Execute_Async(query, transactionId);

        let nextRequestId_JSON_Str = JSON.stringify({ value: nextRequestId });
        if (nextRequestId_Rows.length === 0) {
            await this.db.query_Execute_Async(
                    `INSERT INTO _ABData_Settings (Name, Data)` + 
                    ` VALUES('nextRequestId', '${nextRequestId_JSON_Str}')`,
                    transactionId);
        } else {
            await this.db.query_Execute_Async(
                    `UPDATE _ABData_Settings` + 
                    ` SET Name = 'nextRequestId', Data = '${nextRequestId_JSON_Str}'` + 
                    ` WHERE Name = 'nextRequestId'`, transactionId);
        }

        if (localTransaction)
            await this.db.transaction_Finish_Async(true, transactionId);
    }

    addListener_OnDBSync(listener)
    {
        js0.args(arguments, 'function');

        this._listeners_OnDBSync.push(listener);
    }

    async clearData_Async(transactionId = null)
    {
        js0.args(arguments, [ 'int', js0.Null, js0.Default ]);

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await db.transaction_Start_Async();
            localTransaction = true;
        }

        await NativeDataStore.ResetDeviceLastUpdate_Async(this.db, transactionId);
        await this.clearDBRequests_Async(transactionId);

        if (localTransaction)
            await this.db.transaction_Finish_Async(true, transactionId);
    }

    async clearDeviceDeletedRows_Async(transactionId = null)
    {
        js0.args(arguments, [ 'int', js0.Null, js0.Default ]);

        await this._scheme.getTable('_ABData_DeviceDeletedRows').delete_Async(
                this._db, {}, transactionId);
    }

    async clearDBRequests_Async(transactionId = null)
    {
        js0.args(arguments, [ 'int', js0.Null, js0.Default ]);

        await this.scheme.getT('_ABData_DBRequests').delete_Async(this.db, {}, 
                transactionId);
    }

    async deleteDBRequests_ByIds_Async(requestIds, transactionId = null)
    {
        js0.args(arguments, js0.ArrayItems('number'), [ 'int', js0.Null, 
                js0.Default ]);

        await this.db.query_Execute_Async(
                `DELETE FROM _ABData_DBRequests` +
                ` WHERE Id IN (` + requestIds.join(',') + `)`, transactionId);
    }

    async getDeviceDeletedRows_Async(transactionId = null)
    {
        js0.args(arguments, [ 'int', js0.Null, js0.Default ]);

        let rows = await this.db.query_Select_Async(
                `SELECT TableId, RowId FROM _ABData_DeviceDeletedRows`,
                [ 'Int', 'Long' ], transactionId);

        return rows;
    }

    async getDeviceInfo_Async(transactionId = null)
    {
        js0.args(arguments, [ 'int', js0.Null, js0.Default ]);

        let tSettings = this.scheme.getTable('_ABData_Settings');
        let rDeviceInfo = await tSettings.row_Async(this.db, { where: 
                [ 'Name', '=', 'deviceInfo' ] }, transactionId);

        return rDeviceInfo === null ? null : rDeviceInfo.Data;
    }

    async getDBRequests_ByType_Async(requestName, actionName, 
            transactionId = null)
    {
        js0.args(arguments, 'string', 'string', [ 'int', js0.Null, js0.Default ]);

        let rows = await this.db.query_Select_Async(
                `SELECT Id, RequestName, ActionName, ActionArgs` +
                ` FROM _ABData_DBRequests` +
                ` WHERE RequestName = '${requestName}' AND ActionName = '${actionName}'` +
                ` ORDER BY Id`,
                [ 'Long', 'Int', 'String', 'String', 'String' ], transactionId);

        let rows_Parsed = [];
        for (let row of rows) {
            rows_Parsed.push({
                Id: row[0],
                RequestName: row[1],
                ActionName: row[2],
                ActionArgs: JSON.parse(row[3]),
            });
        }

        return rows_Parsed;
    }

    async getDBRequests_ForSync_Async(transactionId = null)
    {
        js0.args(arguments, [ 'int', js0.Null, js0.Default ]);

        let rows = await this.db.query_Select_Async(
                `SELECT Id, RequestName, ActionName, ActionArgs, SchemeVersion` +
                ` FROM _ABData_DBRequests ORDER BY Id`, 
                [ 'Long', 'String', 'String', 'String', 'Int' ], transactionId);

        for (let row of rows)
            row[3] = JSON.parse(row[3]);

        return rows;
    }

    getRequest(requestName)
    {
        js0.args(arguments, 'string');

        if (!this.hasRequest(requestName))
            throw new Error(`Request '${requestName}' does not exist.`);

        return this._requests[requestName];
    }

    hasRequest(requestName)
    {
        js0.args(arguments, 'string');

        return requestName in this._requests;
    }

    async syncDB_Async(args, clearDataFn, transactionId = null)
    {
        js0.args(arguments, js0.RawObject, 'function', [ 'int', js0.Null, js0.Default ]);

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await this.db.transaction_Start_Async();
            localTransaction = true;
        }

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(this.db, 
                    transactionId);
        let rDBRequests = await this.getDBRequests_ForSync_Async(transactionId);
        let rDeviceDeletedRows = await this.getDeviceDeletedRows_Async(
                transactionId);

        await this.clearDeviceDeletedRows_Async(transactionId);
            
        let response = new Response();

        let result = await webABApi.json_Async(this._apiUri + 'sync-db', { 
            args: args,
            deviceInfo: {
                deviceId: deviceInfo.deviceId,
                deviceHash: deviceInfo.deviceHash,
                lastUpdate: deviceInfo.lastUpdate,
                declaredItemIds: deviceInfo.declaredItemIds,
            },
            rDBRequests: rDBRequests,
            rDeviceDeletedRows: rDeviceDeletedRows,
            schemeVersion: this.scheme.version,
        });

        if (abData.debug)
            console.log('Debug', result);

        response.info = {
            webResult: result,
        };

        if (!result.isSuccess()) {
            if (abData.debug) {
                console.error('Request error: ' + result.message);
                console.error(result);
            }

            response.type = Response.Types_Error;
            response.errorMessage = result.message;

            if (localTransaction)
                await this.db.transaction_Finish_Async(false, transactionId);

            return response;
        }

        response.parseRawObject(result.data.response);

        if (response.type !== Response.Types_Success) {
            if (abData.debug) {
                console.error('Request error: ' + response.message);
                console.error(response);
            }

            if (localTransaction)
                await this.db.transaction_Finish_Async(false, transactionId);

            return response;
        }

        /* Clear Data If Requested */
        if (result.data.clearData) {
            await clearDataFn(transactionId);
        }
        
        /* Process Update Data - Updates */
        try {
            for (let tableName in result.data.updateData.update) {
                if (!this.scheme.hasTable(tableName))
                    continue;

                await this.scheme.getTable(tableName).update_Async(this.db,
                        result.data.updateData.update[tableName], transactionId);
            }
        } catch (e) {
            if (abData.debug)
                console.error(e);

            response.type = Response.Types_Error;
            response.errorMessage = 'Cannot process update data updates: ' + 
                    e.message;

            if (localTransaction)
                await this.db.transaction_Finish_Async(false, transactionId);

            return response;
        }

        /* Process Update Data - Deletes */
        try {
            let rDeviceDeletedRows_New = [];

            for (let tableId in result.data.updateData.delete) {
                if (!this.scheme.hasTable_ById(parseInt(tableId)))
                    continue;

                await this.scheme.getTable_ById(parseInt(tableId)).delete_Async(this.db, {
                    where: [
                        [ '_Id', 'IN', result.data.updateData.delete[tableId] ],
                    ],
                }, transactionId);

                for (let rowId of result.data.updateData.delete[parseInt(tableId)]) {
                    rDeviceDeletedRows_New.push({
                        TableId: parseInt(tableId),
                        RowId: rowId,
                    });
                }
            }

            await this.addDeviceDeletedRows_Async(rDeviceDeletedRows_New, 
                    transactionId);
        } catch (e) {
            if (abData.debug)
                console.error(e);

            response.type = Response.Types_Error;
            response.errorMessage = 'Cannot process update data deletes: ' + 
                    e.message;

            if (localTransaction)
                await this.db.transaction_Finish_Async(false, transactionId);

            return response;
        }

        /* Clear DB Requests */
        try {
            let dbRequestIds = [];
            for (let rDBRequest of rDBRequests)
                dbRequestIds.push(rDBRequest[0]);

            await this.deleteDBRequests_ByIds_Async(dbRequestIds, transactionId);

            this.device.update(result.data.deviceInfo.lastUpdate,
                    result.data.deviceInfo.lastItemId);

            await NativeDataStore.SetDeviceInfo_Async(this.db, this.device.id, 
                    this.device.hash, this.device.lastItemId, 
                    this.device.lastUpdate, [], transactionId);
        } catch (e) {
            if (abData.debug)
                console.error(e);

            response.type = Response.Types_Error;
            response.errorMessage = 'Cannot clear database requests.' + 
                    e.message;

            if (localTransaction)
                await this.db.transaction_Finish_Async(false, transactionId);

            return response;
        }

        /* Process listeners */
        try {
            for (let listener of this._listeners_OnDBSync) {
                if (!(await listener(result, transactionId))) {
                    response.type = Response.Types_Error;
                    response.errorMessage = 'DB Sync listener failure.';

                    if (localTransaction) {
                        await this.db.transaction_Finish_Async(false, 
                                transactionId);
                    }

                    return response;
                }
            }
        } catch (e) {
            if (abData.debug)
                console.error(e);

            response.type = Response.Types_Error;
            response.errorMessage = 'Cannot process db sync listeners: ' + 
                    e.message;

            if (localTransaction)
                await this.db.transaction_Finish_Async(false, transactionId);

            return response;
        }

        if (localTransaction)
            await this.db.transaction_Finish_Async(true, transactionId);

        return response;
    }

    async updateDBRequest_Async(requestId, requestName, actionName, actionArgs,
            transactionId = null)
    {
        js0.args(arguments, [ 'number', js0.Null ], 'string', 'string', 
                js0.RawObject, [ 'int', js0.Null, js0.Default ]);

        if (requestId === null) { 
            await this.addDBRequest_Async(requestName, actionName, actionArgs, 
                    transactionId);
            return;
        }

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await db.transaction_Start_Async();
            localTransaction = true;
        }

        let rows = await this.db.query_Select_Async('SELECT Id FROM _ABData_DBRequests',
                [ 'Long' ], transactionId);
        if (rows.length === 0)
            throw new Error(`DB Request with id '${requestId}' does not exist.`);

        let query = `UPDATE _ABData_DBRequests SET `;
        query += `RequestName = '${requestName}', `;        
        query += `ActionName = '${actionName}', `;
        query += `ActionArgs = '` + Database.EscapeString(JSON.stringify(actionArgs)) + `', `;
        query += `SchemeVersion = ${this.scheme.version}`;

        query += ` WHERE Id = ${requestId}`;

        await this.db.query_Execute_Async(query, transactionId);

        if (localTransaction)
            await this.db.transaction_Finish_Async(true, transactionId);
    }

    // async updateDeviceInfo_Async()
    // {
    //     js0.args(arguments);

    //     let localTransaction = await db.transaction_StartLocal_Async();

    //     let lastDeclaredItemId = this.device.lastItemId;
    //     // for (let itemId_Declared of this.device.declaredItemIds) {
    //     //     if (itemId_Declared > lastDeclaredItemId)
    //     //         lastDeclaredItemId = itemId_Declared;
    //     // }

    //     let deviceInfo = await this.getDeviceInfo_Async();
    //     if (deviceInfo === null) {
    //         if (localTransaction)
    //             await this.db.transaction_Finish_Async(false);
                
    //         return;
    //     }

    //     let declaredItemIds = deviceInfo.declaredItemIds;
    //     for (let itemId of this.device.declaredItemIds) {
    //         if (!declaredItemIds.includes(itemId))
    //             declaredItemIds.push(itemId);
    //     }

    //     await this.setDeviceInfo_Async( 
    //             device.id, device.hash, lastDeclaredItemId, 
    //             device.lastUpdate, declaredItemIds);

    //     if (localTransaction)
    //         await this.db.transaction_Finish_Async(true);
    // }

}
module.exports = NativeDataStore;