'use strict';

const
    js0 = require('js0')
;

class RequestProcessor
{

    constructor(dataScheme)
    {
        js0.args(arguments, require('./scheme/DataScheme'));
    }

    async processRequest_Async(deviceInfo, requestName, actionName, actionArgs) {
        js0.args(arguments, js0.RawObject, 'string', 'string', js0.RawObject);

        let response = await this.processRequestBatch_Async(deviceInfo, [
            [ 'request', requestName, actionName, actionArgs ],
        ]);

        if (response === null)
            return null;

        return response.request;
    }

    async getDeviceInfo_Async() { js0.virtual(this); }
    async processRequestBatch_Async(requests) { js0.virtual(this); }

}
module.exports = RequestProcessor;