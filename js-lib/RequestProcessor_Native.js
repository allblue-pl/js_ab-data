'use strict';

const
    abLock = require('ab-lock'),
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    abData = require('.'),
    NativeDataStore = require('./native/NativeDataStore'),
    RequestProcessor = require('./RequestProcessor')
;

class RequestProcessor_Native extends RequestProcessor
{

    constructor(dataScheme, device, apiUri, db)
    {
        js0.args(arguments, require('./scheme/DataScheme'), require('./native/NativeDevice'),
                'string', require('./native/Database'));

        super(dataScheme, device);

        this._scheme = dataScheme;
        this._device = device;
        this._apiUri = apiUri;
        this._db = db;
        this._requests = {};
        this._listeners_OnDBSync = [];
    }

    addListener_OnDBSync(listener)
    {
        js0.args(arguments, 'function');

        this._listeners_OnDBSync.push(listener);
    }

    // async clearData_Async()
    // {
        
    // }

    // async getDeviceInfo_Async()
    // {
    //     let deviceInfo = await this._db.nativeActions.callNative_Async(
    //             'GetDeviceInfo', {});
    //     if (deviceInfo.deviceId !== null)
    //         return deviceInfo;
    // }

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

    async processRequestBatch_Async(requests)
    {
        js0.args(arguments, Array);

        let response = {
            success: false,
            error: null,
        };

        let success = true;

        let localTransaction = await this._db.transaction_StartLocal_Async();

        let requests_W = [];
        for (let request of requests) {
            let requestId = request[0];
            let requestName = request[1];
            let actionName = request[2];
            let actionArgs = request[3];

            let result = null;
            try {
                result = await this.getRequest(requestName)
                        .executeAction_Async(this._device, actionName, actionArgs);

                this._scheme.validateResult(request, result);
            } catch (e) {
                result = {
                    success: false,
                    error: `Request Action Error: ` + e.toString(),
                }

                console.error(`Request Action Error: '${requestName}:${actionName}'`);
                console.error(e);
            }

            response[requestId] = result;

            if (!result.success)
                success = false;

            if (result.error !== null) {
                // response.errors.push([ `${requestName}:${actionName}:${requestId}`, 
                //         result.error]);
                response.error = `Action error: ${requestName}:${actionName}:${requestId}`;

                if (abData.debug) {
                    console.error(`Error processing action '${requestName}:${actionName}:${requestId}'`, 
                            actionArgs);
                    console.error('Action Error:', result.error);
                }
            }

            if (this._scheme.getRequestDef(requestName)
                    .getActionDef(actionName).type === 'w') {
                if (!result.success)
                    success = false;
                
                requests_W.push([ requestName, actionName, actionArgs ]);
            }
        }

        if (success && requests_W.length > 0)
            success = await this._db.addDBRequests_Async(requests_W);

        if (success)
            await this._updateDeviceInfo_Async();

        if (localTransaction)
            await this._db.transaction_Finish_Async(success);

        response.success = success;

        return response;
    }

    // async register_Async()
    // {
    //     let result = await webABApi.json_Async(this._apiUri + 'register-device', {});

    //     if (!result.isSuccess()) {
    //         if (abData.debug)
    //             console.error(result.data.data);
         
    //         throw new Error('Cannot register device: ' + result.message);
    //     }

    //     if (!await this._db.nativeActions.callNative_Async('SetDeviceInfo', { 
    //         deviceId: result.data.deviceInfo.deviceId,
    //         deviceHash: result.data.deviceInfo.deviceHash,
    //         lastUpdate: null,
    //             }))
    //         throw new Error('Cannot set device info.');
    // }

    setR(requestName, request)
    {
        this.setRequest(requestName, request);
    }

    setRequest(requestName, request)
    {
        js0.args(arguments, 'string', require('./native/Request'));

        if (requestName in this._requests)
            throw new Error(`Request '${requestName}' already exists.`);

        this._requests[requestName] = request;
    }

    async syncDB_Async(args)
    {
        js0.args(arguments, js0.RawObject);

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(
                this._scheme, this._db);
        let rDBRequests = await this._db.getDBRequests_ForSync_Async();

        let result = await webABApi.json_Async(this._apiUri + 'sync-db', { 
            args: args,
            deviceInfo: {
                deviceId: deviceInfo.deviceId,
                deviceHash: deviceInfo.deviceHash,
                lastUpdate: deviceInfo.lastUpdate, //this.device.lastUpdate,
                declaredItemIds: deviceInfo.declaredItemIds,
            },
            rDBRequests: rDBRequests 
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

        let localTransaction = await this._db.transaction_StartLocal_Async();

        // let result_DeviceInfo = await this.updateDeviceInfo(result.data.deviceInfo.lastId,
        //             result.data.deviceInfo.lastUpdate);
        // if (!result_DeviceInfo.success) {
        //     success = false;
        //     console.error('Cannot update device info.', result_DeviceInfo.error);
        // }

        for (let tableName in response.updateData.update) {
            if (!this._scheme.hasTable(tableName))
                continue;

            await this._scheme.getTable(tableName).update_Async(this._db,
                    response.updateData.update[tableName]);
        }

        for (let tableId in response.updateData.delete) {
            if (!this._scheme.hasTable_ById(parseInt(tableId)))
                continue;

            await this._scheme.getTable_ById(parseInt(tableId)).delete_Async(this._db, {
                where: [
                    [ '_Id', 'IN', response.updateData.delete[tableId] ],
                ],
            });
        }
        
        if (success) {
            let dbRequestIds = [];
            for (let rDBRequest of rDBRequests)
                dbRequestIds.push(rDBRequest[0]);

            await this._db.clearDBRequests_Async(dbRequestIds);

            this.device.setLastUpdate(result.data.deviceInfo.lastUpdate);
            // this.device.update(result.data.deviceInfo.lastUpdate,
            //         result.data.deviceInfo.lastItemId);

            await NativeDataStore.SetDeviceInfo_Async(this._scheme, this._db, 
                    this.device.id, this.device.hash, 
                    this.device.lastItemId, this.device.lastUpdate,
                    []);
        }

        if (localTransaction)
            await this._db.transaction_Finish_Async(success);

        return {
            success: true,
            error: null,
        };
    }


    async _updateDeviceInfo_Async()
    {
        js0.args(arguments);

        let localTransaction = await this._db.transaction_StartLocal_Async();

        let lastDeclaredItemId = this.device.lastItemId;
        // for (let itemId_Declared of this.device.declaredItemIds) {
        //     if (itemId_Declared > lastDeclaredItemId)
        //         lastDeclaredItemId = itemId_Declared;
        // }

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(this._scheme, 
                this._db);
        let declaredItemIds = deviceInfo.declaredItemIds;
        for (let itemId of this.device.declaredItemIds) {
            if (!declaredItemIds.includes(itemId))
                declaredItemIds.push(itemId);
        }

        await NativeDataStore.SetDeviceInfo_Async(this._scheme, this._db, 
                this.device.id, this.device.hash, lastDeclaredItemId, 
                this.device.lastUpdate, declaredItemIds);

        if (localTransaction)
            await this._db.transaction_Finish_Async(true);
    }

}
module.exports = RequestProcessor_Native;