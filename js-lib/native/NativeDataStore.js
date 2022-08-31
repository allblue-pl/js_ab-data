'use strict';

const
    abData = require('ab-data'),
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    DataStore = require('../DataStore'),
    Database = require('./Database'),
    DatabaseInfo = require('../DatabaseInfo')
;

class NativeDataStore extends DataStore
{

    static async GetDeviceInfo_Async(db)
    {
        js0.args(arguments, abData.native.Database);

        let rows = await db.query_Select_Async(
                `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'deviceInfo'`, 
                [ 'String', 'String' ]);

        if (rows.length === 0)
            return null;

        let deviceInfo = JSON.parse(rows[0][1])['value'];
        
        return deviceInfo;
    }

    static async GetDBSchemeVersion_Async(db)
    {
        js0.args(arguments, abData.native.Database);

        let version = null;
        try {
            let version_Rows = await db.query_Select_Async(
                    `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'version'`, 
                    [ 'String', 'String' ]);
            if (version_Rows.length !== 0)
                version = JSON.parse(version_Rows[0][1])['value'];
        } catch (e) {
            if (e instanceof require('./ABDDatabaseError')) {
                return -1
            } else 
                throw e;
        }

        return version;
    }

    static async InitDeviceInfo_Async(db)
    {
        js0.args(arguments, abData.native.Database);

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(db);
        if (deviceInfo === null)
            return null;

        deviceInfo.declaredItemIds = [];
        deviceInfo.usedItemIds = [];
        
        return deviceInfo;
    }

    static async ResetDeviceLastUpdate_Async(db)
    {
        js0.args(arguments, abData.native.Database);

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(db);
        if (deviceInfo === null)
            return;

        deviceInfo.lastUpdate = null;
        await NativeDataStore.SetDeviceInfo_Async(db, deviceInfo.deviceId,
                deviceInfo.deviceHash, deviceInfo.lastItemId, 
                deviceInfo.lastUpdate, deviceInfo.declaredItemIds);
    }

    static async SetDeviceInfo_Async(db, deviceId, deviceHash, lastItemId, lastUpdate,
            declaredItemIds)
    {
        js0.args(arguments, abData.native.Database,
                js0.Long, 'string', js0.Long, [ js0.Long, js0.Null ], Array);

        let deviceInfo_Old = await NativeDataStore.GetDeviceInfo_Async(db);
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
                ` VALUES('deviceInfo', '${deviceInfo_JSON_Str}')`);
        } else {
            await db.query_Execute_Async(
                `UPDATE _ABData_Settings` + 
                ` SET Name = 'deviceInfo', Data = '${deviceInfo_JSON_Str}'` + 
                ` WHERE Name = 'deviceInfo'`);
        }
    }

    static async SetDBSchemeVersion_Async(db, version)
    {
        let version_Old = await NativeDataStore.GetDBSchemeVersion_Async(db);

        let version_JSON_Str = JSON.stringify({ value: version, });
        if (version_Old === null) {
            await db.query_Execute_Async(
                    `INSERT INTO _ABData_Settings (Name, Data)` + 
                    ` VALUES('version', '${version_JSON_Str}')`);
        } else {
            await db.query_Execute_Async(
                    `UPDATE _ABData_Settings` + 
                    ` SET Name = 'version', Data = '${version_JSON_Str}'` + 
                    ` WHERE Name = 'version'`);
        }

        return version;
    }

    static async UpdateDBScheme_Async(db, scheme)
    {
        js0.args(arguments, require('./Database'), 
                require('../scheme/DataScheme'));

        let dbInfo_Scheme = scheme.createDatabaseInfo();
        let dbInfo_DB = await db.createDatabaseInfo_Async();

        let actions = DatabaseInfo.Compare(scheme, dbInfo_Scheme, dbInfo_DB);

        for (let tableInfo of actions.tables.delete) {
            let query = `DROP TABLE ${tableInfo.name}`;
            await db.query_Execute_Async(query);
        }

        for (let tableInfo of actions.tables.create) {
            let query = tableInfo.getQuery_Create();

            console.log(query);
            await db.query_Execute_Async(query);
        }

        for (let alterInfo of actions.tables.alter) {
            for (let fieldInfo of alterInfo.delete) {
                let query_Alter = `ALTER TABLE ${alterInfo.tableInfo.name}` +
                        ` DROP COLUMN \`${fieldInfo.name}\``;
                let result = await db.query_Execute_Async(query_Alter);
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

                let result = await db.query_Execute_Async(query_Alter);
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

        await NativeDataStore.SetDBSchemeVersion_Async(db, scheme.version);

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

    async addDBRequest_Async(requestName, actionName, actionArgs)
    {
        js0.args(arguments, 'string', 'string', js0.RawObject);

        let localTransaction = await this.db.transaction_StartLocal_Async();

        let nextRequestId = 1;
        let nextRequestId_Rows = await this.db.query_Select_Async(
                `SELECT Name, Data FROM _ABData_Settings WHERE Name = 'nextRequestId'`, 
                [ 'String', 'String' ]);
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

        await this.db.query_Execute_Async(query);

        let nextRequestId_JSON_Str = JSON.stringify({ value: nextRequestId });
        if (nextRequestId_Rows.length === 0) {
            await this.db.query_Execute_Async(
                    `INSERT INTO _ABData_Settings (Name, Data)` + 
                    ` VALUES('nextRequestId', '${nextRequestId_JSON_Str}')`);
        } else {
            await this.db.query_Execute_Async(
                    `UPDATE _ABData_Settings` + 
                    ` SET Name = 'nextRequestId', Data = '${nextRequestId_JSON_Str}'` + 
                    ` WHERE Name = 'nextRequestId'`);
        }

        if (localTransaction)
            await this.db.transaction_Finish_Async(true);
    }

    addListener_OnDBSync(listener)
    {
        js0.args(arguments, 'function');

        this._listeners_OnDBSync.push(listener);
    }

    async clearData_Async()
    {
        js0.args(arguments);

        let localTransaction = await this.db.transaction_StartLocal_Async();

        await NativeDataStore.ResetDeviceLastUpdate_Async(this.db);
        await this.clearDBRequests_Async();

        if (localTransaction)
            await this.db.transaction_Finish_Async(true);
    }

    async clearDBRequests_Async()
    {
        js0.args(arguments);

        await this.scheme.getT('_ABData_DBRequests').delete_Async(this.db, {});
    }

    async deleteDBRequests_ByIds_Async(requestIds)
    {
        js0.args(arguments, js0.ArrayItems('number'));

        await this.db.query_Execute_Async(
                `DELETE FROM _ABData_DBRequests` +
                ` WHERE Id IN (` + requestIds.join(',') + `)`);
    }

    async getDeviceInfo_Async()
    {
        js0.args(arguments);

        let tSettings = this.scheme.getTable('_ABData_Settings');
        let rDeviceInfo = (await tSettings.row_Async(this.db, { where: [ 'Name', '=', 'deviceInfo' ] }))

        return rDeviceInfo === null ? null : rDeviceInfo.Data;
    }

    async getDBRequests_ByType_Async(requestName, actionName)
    {
        js0.args(arguments, 'string', 'string');

        let rows = await this.db.query_Select_Async(
                `SELECT Id, RequestName, ActionName, ActionArgs` +
                ` FROM _ABData_DBRequests` +
                ` WHERE RequestName = '${requestName}' AND ActionName = '${actionName}'` +
                ` ORDER BY Id`,
                [ 'Long', 'Int', 'String', 'String', 'String' ]);

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

    async getDBRequests_ForSync_Async()
    {
        let rows = await this.db.query_Select_Async(
                `SELECT Id, RequestName, ActionName, ActionArgs, SchemeVersion` +
                ` FROM _ABData_DBRequests ORDER BY Id`, 
                [ 'Long', 'String', 'String', 'String', 'Int' ]);

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

    async syncDB_Async(args)
    {
        js0.args(arguments, js0.RawObject);

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(this.db);
        let rDBRequests = await this.getDBRequests_ForSync_Async();

        console.log(deviceInfo);
        console.log(rDBRequests);

        let result = await webABApi.json_Async(this._apiUri + 'sync-db', { 
            args: args,
            deviceInfo: {
                deviceId: deviceInfo.deviceId,
                deviceHash: deviceInfo.deviceHash,
                lastUpdate: deviceInfo.lastUpdate,
                declaredItemIds: deviceInfo.declaredItemIds,
            },
            rDBRequests: rDBRequests ,
            schemeVersion: this.scheme.version,
        });
        
        if (result.isError()) {
            console.warn(result.data.data);

            return {
                success: false,
                error: result.message,
            };
        } else if (result.isFailure()) {
            console.warn(result.data.response);

            return {
                success: false,
                error: result.message,
            };
        }

        for (let listener of this._listeners_OnDBSync)
            await listener(result.data);

        let response = result.data.response;

        if (!response.success)
            console.warn(response);

        let success = true;

        let localTransaction = await this.db.transaction_StartLocal_Async();

        for (let tableName in response.updateData.update) {
            if (!this.scheme.hasTable(tableName))
                continue;

            await this.scheme.getTable(tableName).update_Async(this.db,
                    response.updateData.update[tableName]);
        }

        for (let tableId in response.updateData.delete) {
            if (!this.scheme.hasTable_ById(parseInt(tableId)))
                continue;

            await this.scheme.getTable_ById(parseInt(tableId)).delete_Async(this.db, {
                where: [
                    [ '_Id', 'IN', response.updateData.delete[tableId] ],
                ],
            });
        }
        
        if (success) {
            let dbRequestIds = [];
            for (let rDBRequest of rDBRequests)
                dbRequestIds.push(rDBRequest[0]);

            await this.deleteDBRequests_ByIds_Async(dbRequestIds);

            this.device.setLastUpdate(result.data.deviceInfo.lastUpdate);

            await NativeDataStore.SetDeviceInfo_Async(this.db, this.device.id, 
                    this.device.hash, this.device.lastItemId, 
                    this.device.lastUpdate, []);
        }

        if (localTransaction)
            await this.db.transaction_Finish_Async(success);

        return {
            success: true,
            error: null,
        };
    }

    async updateDBRequest_Async(requestId, requestName, actionName, actionArgs)
    {
        js0.args(arguments, [ 'number', js0.Null ], 'string', 'string', js0.RawObject);

        let localTransaction = await this.db.transaction_StartLocal_Async();

        if (requestId === null) { 
            await this.addDBRequest_Async(requestName, actionName, actionArgs);
            return;
        }

        let rows = await this.db.query_Select_Async('SELECT Id FROM _ABData_DBRequests',
                [ 'Long' ]);
        if (rows.length === 0)
            throw new Error(`DB Request with id '${requestId}' does not exist.`);

        let query = `UPDATE _ABData_DBRequests SET `;
        query += `RequestName = '${requestName}', `;        
        query += `ActionName = '${actionName}', `;
        query += `ActionArgs = '` + Database.EscapeString(JSON.stringify(actionArgs)) + `', `;
        query += `SchemeVersion = ${this.scheme.version}`;

        query += ` WHERE Id = ${requestId}`;

        await this.db.query_Execute_Async(query);

        if (localTransaction)
            await this.db.transaction_Finish_Async(true);
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