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


    constructor(dataScheme, device)
    {
        js0.args(arguments, require('./scheme/DataScheme'), require('./Device'));

        this._scheme = dataScheme;
        this._device = device;
    }

    async processRequest_Async(requestName, actionName, actionArgs) {
        js0.args(arguments, 'string', 'string', js0.RawObject);

        let response = await this.processRequestBatch_Async([
            [ 'request', requestName, actionName, actionArgs, this.scheme.version ],
        ]);

        if (response === null)
            return null;

        return response.request;
    }

    async processRequestBatch_Async(requests, args) { js0.virtual(this); }

}
module.exports = RequestProcessor;