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

    get db() {
        return this._db;
    }


    constructor(dataScheme, device, db)
    {
        js0.args(arguments, require('./scheme/DataScheme'), 
                require('./native/NativeDevice'), require('./native/Database'));

        super(dataScheme, device);

        this._scheme = dataScheme;
        this._device = device;
        this._db = db;

        this._requests = {};
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

    setR(requestName, request)
    {
        return this.setRequest(requestName, request);
    }

    setRequest(requestName, request)
    {
        js0.args(arguments, 'string', require('./native/Request'));

        if (requestName in this._requests)
            throw new Error(`Request '${requestName}' already exists.`);

        this._requests[requestName] = request;

        return this;
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

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(this._db);
        let declaredItemIds = deviceInfo.declaredItemIds;
        for (let itemId of this.device.declaredItemIds) {
            if (!declaredItemIds.includes(itemId))
                declaredItemIds.push(itemId);
        }

        await NativeDataStore.SetDeviceInfo_Async(this._db, 
                this.device.id, this.device.hash, lastDeclaredItemId, 
                this.device.lastUpdate, declaredItemIds);

        if (localTransaction)
            await this._db.transaction_Finish_Async(true);
    }

}
module.exports = RequestProcessor_Native;