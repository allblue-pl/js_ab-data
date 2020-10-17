'use strict';

const
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    RequestProcessor = require('./RequestProcessor'),

    abData = require('.')
;

class RequestProcessor_Web extends RequestProcessor
{

    constructor(dataScheme, device, apiUri)
    {
        super(dataScheme, device);
        js0.args(arguments, require('./scheme/DataScheme'), require('./Device'),
                'string');

        this._apiUri = apiUri;
    }

    processRequestBatch_Async(requests)
    {
        js0.args(arguments, Array);

        return new Promise((resolve, reject) => {
            webABApi.json(this._apiUri + 'request', { 
                deviceInfo: {
                    deviceId: this.device.id,
                    deviceHash: this.device.hash,
                },
                requests: requests,
                    }, (result) => {
                if (!result.isSuccess()) {
                    console.error('Request error: ' + result.message);
                    if (abData.debug)
                        console.warn(result.data.data);
                    
                    reject(result.message);
                    return;
                }
    
                resolve(result.data.response);
            });
        });
    }

    updateDB_Async()
    {
        // Do nothing.
    }

}
module.exports = RequestProcessor_Web;