'use strict';

const
    js0 = require('js0'),

    abData = require('.'),
    Response = require('./Response')
;

class DataStore {

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

    nextId() {
        return this.device.nextId();
    }

    async request_Async(requestName, actionName, actionArgs, 
            transactionId = null) {
        js0.args(arguments, 'string', 'string', [ js0.RawObject, js0.Default ],
                [ 'int', js0.Null, js0.Default ]);

        try {
            this.scheme.validateRequest([ 'request', requestName, actionName, 
                    actionArgs ]);
        } catch (err) {
            if (abData.debug)
                console.error(err);

            return abData.Response.Create({
                actionErrors: {
                    request: err.toString(),
                },
                errorMessage: `Action '${requestName}:${actionName}' error.`,
                info: {},
                requestIds: [],
                results: {},
                type: Response.Types_ActionError,
            });
        }

        let response = await this._requestProcessor.processRequest_Async(
                requestName, actionName, actionArgs, transactionId);

        // this._validateResults([ result ]);

        return response;
    }

    async requestB_Async(requests, transactionId = null) {
        return await this.requestBatch_Async(requests, transactionId);
    }

    async requestBatch_Async(requests, transactionId = null) {
        js0.args(arguments, js0.ArrayItems(js0.PresetArray([ 'string', 'string', 
                'string', js0.RawObject ])), [ 'int', js0.Null, js0.Default ]);

        for (let request of requests) {
            try {
                this.scheme.validateRequest(request)
            } catch(err) {
                return {
                    actionErrors: {
                        [request[0]]: err.toString(),
                    },
                    errorMessage: `Action '${request[0]}:${request[1]}' error.`,
                    info: {},
                    requestIds: [],
                    results: {},
                    type: Response.Types_ActionError,
                };
            }
        }

        let response = await this._requestProcessor.processRequestBatch_Async(
                requests, transactionId);

        for (let request of requests)
            this.scheme.validateRequestResponse(response, request);

        return response;
    }

}
module.exports = DataStore;