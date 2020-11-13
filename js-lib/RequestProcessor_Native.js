'use strict';

const
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    abData = require('.'),
    RequestProcessor = require('./RequestProcessor')
;

class RequestProcessor_Native extends RequestProcessor
{

    constructor(dataScheme, device, apiUri, db)
    {
        js0.args(arguments, require('./scheme/DataScheme'), require('./Device'),
                'string', require('./native/Database'));
        super(dataScheme, device);

        this._scheme = dataScheme;
        this._apiUri = apiUri;
        this._db = db;
        this._requests = {};
    }

    async getDeviceInfo_Async()
    {
        let deviceInfo = await this._db.nativeActions.callNative_Async(
                'GetDeviceInfo', {});
        if (deviceInfo.deviceId !== null)
            return deviceInfo;
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

    async processRequestBatch_Async(requests)
    {
        js0.args(arguments, Array)

        let response = {
            success: false,
            error: null,
        };

        let success = true;

        await this._db.transaction_Start_Async();

        let requests_W = [];
        for (let request of requests) {
            let requestId = request[0];
            let requestName = request[1];
            let actionName = request[2];
            let actionArgs = request[3];

            let result = await this.getRequest(requestName)
                    .executeAction_Async(actionName, actionArgs);
            response[requestId] = result;

            if (!result.success) {
                if (response.error === null)
                    response.error = result.error;
                else {
                    response.error += ' ' + `[Request '${requestId}':` + 
                            result.error + `']`;
                }

                if (abData.debug) {
                    console.error(`Cannot process action '${requestName}:${actionName}'`, 
                            actionArgs);
                    console.error('Action error:', result.error);
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

        if (!(await this._db.transaction_Finish_Async(success))) {
            success = false;
            if (abData.debug)
                console.error('Cannot commit.');
        }

        response.success = success;

        return response;
    }

    async register_Async()
    {
        let result = await webABApi.json_Async(this._apiUri + 'register-device', {});

        console.log(result);

        if (!result.isSuccess()) {
            if (abData.debug)
                console.error(result.data.data);
         
            throw new Error('Cannot register device: ' + result.message);
        }

        if (!await this._db.nativeActions.callNative_Async('SetDeviceInfo', { 
            deviceId: result.data.deviceInfo.deviceId,
            deviceHash: result.data.deviceInfo.deviceHash,
            lastUpdate: null,
                }))
            throw new Error('Cannot set device info.');
    }

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

    async syncDB_Async()
    {
        let rDBRequests = await this._db.getDBRequests_Async();
        
        let result = await webABApi.json_Async(this._apiUri + 'sync-db', { 
            deviceInfo: {
                deviceId: this.device.id,
                deviceHash: this.device.hash,
                lastUpdate: this.device.lastUpdate,
            },
            rDBRequests: rDBRequests 
        });
        
        if (!result.isSuccess())
            console.warn(result.data.data);

        let response = result.data.response;

        if (!response.success)
            console.warn(response);

        let success = true;

        await this._db.transaction_Start_Async();

        console.log(result.data);

        let result_DeviceInfo = await this.updateDeviceInfo(result.data.deviceInfo.lastId,
                    result.data.deviceInfo.lastUpdate);
        console.log(result_DeviceInfo);
        if (!result_DeviceInfo.success) {
            success = false;
            console.error('Cannot update device info.', result_DeviceInfo.error);
        }

        for (let tableName in response.updateData.update) {
            if (!this._scheme.hasTable(tableName))
                continue;

            let result = await this._scheme.getTable(tableName).update_Async(this._db,
                    response.updateData.update[tableName]);
            
            if (!result.success) {
                success = false;
                console.warn(result.error);
            }
        }

        for (let tableName in response.updateData.delete) {
            if (!this._scheme.hasTable(tableName))
                continue;

            let result = await this._scheme.getTable(tableName).delete_Async(this._db, {
                where: [
                    [ '_Id', 'IN', response.updateData.delete[tableName] ],
                ],
            });

            if (!result.success) {
                success = false;
                console.warn(result.error);
            }
        }

        let result_Transaction = await this._db.transaction_Finish_Async(success);
        if (!result_Transaction.success) {
            console.warn('Transaction: ' + result_Transaction.error);
            return {
                success: false,
                error: 'Cannot commit.',
            };
        }

        this.device.update(result.data.deviceInfo.lastId, 
                result.data.deviceInfo.lastUpdate);

        console.log('Device', this.device);

        return {
            success: true,
            error: null,
        };
    }

    async updateDeviceInfo(lastId, lastUpdate)
    {
        let tSettings = this._scheme.getTable('_Native_Settings');
        return tSettings.update_Async(this._db, [
            {
                Name: 'deviceInfo',
                Data: {
                    deviceId: this.device.id,
                    deviceHash: this.device.hash,
                    lastId: lastId,
                    lastUpdate: lastUpdate,
                }
            },
        ]);
    }

}
module.exports = RequestProcessor_Native;