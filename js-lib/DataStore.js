'use strict';

const
    js0 = require('js0')
;

class DataStore
{

    get device() {
        return this._requestProcessor.device;
    }

    get lastId() {
        return this._device.lastId;
    }

    get requestProcessor()
    {
        return this._requestProcessor;
    }

    get scheme() {
        return this._scheme;
    }


    constructor(requestProcessor)
    {
        js0.args(arguments, require('./RequestProcessor'));

        this._requestProcessor = requestProcessor;
        this._scheme = requestProcessor.scheme;
    }

    getT(tableName)
    {
        return this.getTable(tableName);
    }

    getTable(tableName)
    {
        js0.args(arguments, 'string');

        if (!(this._scheme.tables.has(tableName)))
            throw new Error(`Table '${tableName}' does not exist.`);

        return this._scheme.tables.get(tableName);
    }

    // async init_Async()
    // {
    //     this._deviceInfo = await this._requestProcessor.getDeviceInfo_Async();

    //     console.log(this._deviceInfo);
    // }

    // isRegistered()
    // {
    //     return this._deviceInfo.deviceId !== null;
    // }

    nextId()
    {
        return this.device.nextId();
    }

    // async register_Async()
    // {
    //     await this._requestProcessor.register_Async();
    // }

    async request_Async(requestName, actionName, actionArgs)
    {
        js0.args(arguments, 'string', 'string', [ js0.RawObject, js0.Default ]);

        this.scheme.validateRequest([ 'request', requestName, actionName, actionArgs ]);

        return await this._requestProcessor.processRequest_Async(
                requestName, actionName, actionArgs);
    }

    async requestB_Async(requests)
    {
        return await this.requestBatch_Async(requests);
    }

    async requestBatch_Async(requests, requestArgs = {})
    {
        js0.args(arguments, js0.ArrayItems(js0.PresetArray([ 'string', 'string', 
                'string', js0.RawObject ])));

        for (let request of requests)
            this.scheme.validateRequest(request)

        let response = await this._requestProcessor.processRequestBatch_Async(
                requests, requestArgs);

        for (let request of requests)
            this.scheme.validateResponse(response, request);

        return response;
    }

    async syncDB_Async(args)
    {
        return await this._requestProcessor.syncDB_Async(args);
    }

    async updateDB_Async()
    {
        return await this._requestProcessor.updateDB_Async();
    }


    // _validateResponse(response, request)
    // {
    //     if (response === null)
    //         return;

    //     let requestId = request[0];
    //     let requestName = request[1];
    //     let actionName = request[2];
    //     let actionArgs = request[3];

    //     let requestDef = this._scheme.getRequestDef(requestName);
    //     let actionDef = requestDef.getActionDef(actionName);

    //     if (!(requestId in response))
    //         throw new Error(`Result '${requestId}' not found in response.`);

    //     let errors = [];
    //     if (!js0.type(response[requestId], js0.Preset(actionDef.resultDef), errors)) {
    //         console.error(`Result errors:`, errors);
    //         throw new Error(`Request action '${requestName}:${actionName}' result error.`);
    //     }
    // }

    // _validateRequest(request)
    // {
    //     let requestId = request[0];
    //     let requestName = request[1];
    //     let actionName = request[2];
    //     let actionArgs = request[3];

    //     if (!this._scheme.hasRequestDef(requestName))
    //         throw new Error(`Request '${requestName}' not defined.`);
        
    //     let requestDef = this._scheme.getRequestDef(requestName);

    //     if (!requestDef.hasActionDef(actionName))
    //         throw new Error(`Action '${requestName}:${actionName}' not defined.`);

    //     let actionDef = requestDef.getActionDef(actionName);
    //     let errors = [];
    //     console.log(actionArgs, actionDef.argsDef);
    //     if (!js0.type(actionArgs, js0.Preset(actionDef.argsDef), errors)) {
    //         console.error(`Args errors:`, errors);
    //         throw new Error(`Request action '${requestName}:${actionName}' args error.`);
    //     }
    // }

}
module.exports = DataStore;