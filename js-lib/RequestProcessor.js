'use strict';

const
    js0 = require('js0')
;

class RequestProcessor
{

    get device() {
        return this._device;
    }

    get scheme() {
        return this._scheme;
    }


    constructor(dataScheme, device) {
        js0.args(arguments, require('./scheme/DataScheme'), require('./Device'));

        this._scheme = dataScheme;
        this._device = device;

        this._processingQueue = [];
        this._nextProcessingId = 0;
    }

    async processRequest_Async(requestName, actionName, actionArgs, 
            transactionId = null) {
        js0.args(arguments, 'string', 'string', js0.RawObject, [ 'int', 
                js0.Null, js0.Default ]);

        let response = await this.processRequestBatch_Async([
            [ 'request', requestName, actionName, actionArgs, this.scheme.version ],
        ]);

        if (response === null)
            return null;

        return response;
    }

    async processRequestBatch_Async(requests, transactionId = null) { 
        js0.args(arguments, Array, [ 'int', js0.Null, js0.Default ]);

        let processingId = this._nextProcessingId;
        this._nextProcessingId++;

        this._processingQueue.push({
            processingId: processingId,
            requests: requests,
            transactionId: transactionId,
        });

        let response = await this._processRequestBatchHelper_Async(processingId, 
                requests, transactionId)

        // let response = await this.__processRequestBatch_Async(requests, 
        //         transactionId);

        js0.typeE(response, require('./Response'));

        return response;
    }


   _processRequestBatchHelper_Async(processingId, requests, transactionId) {
        return new Promise((resolve, reject) => {
            if (this._processingQueue[0].processingId === processingId) {
                this.__processRequestBatch_Async(requests, transactionId)
                        .then((response) => {
                    this._processingQueue.splice(0, 1);
                    resolve(response);
                });
                return;
            }

            setTimeout(() => {
                resolve(this._processRequestBatchHelper_Async(processingId,
                        requests, transactionId));
            }, 50);
        });
    }


    async __processRequestBatch_Async(requests, transactioId) { js0.virtual(this); }

}
module.exports = RequestProcessor;