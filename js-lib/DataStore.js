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

    get requestProcessor() {
        return this._requestProcessor;
    }

    get scheme() {
        return this._scheme;
    }


    constructor(requestProcessor) {
        js0.args(arguments, require('./RequestProcessor'));

        this._requestProcessor = requestProcessor;
        this._scheme = requestProcessor.scheme;
    }

    getT(tableName) {
        return this.getTable(tableName);
    }

    getTable(tableName) {
        js0.args(arguments, 'string');

        if (!(this._scheme.hasTable(tableName)))
            throw new Error(`Table '${tableName}' does not exist.`);

        return this._scheme.getTable(tableName);
    }

    nextId() {
        return this.device.nextId();
    }

    async request_Async(requestName, actionName, actionArgs, 
            transactionId = null) {
        js0.args(arguments, 'string', 'string', [ js0.RawObject, js0.Default ],
                [ 'int', js0.Null, js0.Default ]);

        this.scheme.validateRequest([ 'request', requestName, actionName, 
                actionArgs ]);

        let result = await this._requestProcessor.processRequest_Async(
                requestName, actionName, actionArgs, transactionId);

        // this._validateResults([ result ]);

        return result;
    }

    async requestB_Async(requests, transactionId = null) {
        return await this.requestBatch_Async(requests, transactionId);
    }

    async requestBatch_Async(requests, transactionId = null) {
        js0.args(arguments, js0.ArrayItems(js0.PresetArray([ 'string', 'string', 
                'string', js0.RawObject ])), [ 'int', js0.Null, js0.Default ]);

        for (let request of requests)
            this.scheme.validateRequest(request)

        let response = await this._requestProcessor.processRequestBatch_Async(
                requests, transactionId);

        for (let request of requests)
            this.scheme.validateRequestResponse(response, request);

        return response;
    }

}
module.exports = DataStore;