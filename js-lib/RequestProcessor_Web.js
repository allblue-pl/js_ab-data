'use strict';

const
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    RequestProcessor = require('./RequestProcessor'),

    abData = require('.')
;

class RequestProcessor_Web extends RequestProcessor
{

    constructor(dataScheme, apiUri)
    {
        super(dataScheme);
        js0.args(arguments, require('./scheme/DataScheme'), 'string');

        this._dataScheme = dataScheme;
        this._apiUri = apiUri;
    }

    async getDeviceInfo_Async()
    {
        let result = await webABApi.json_Async(this._apiUri + 'register-device', {
            fixed: false,
        });

        if (!result.isSuccess()) {
            if (abData.debug)
                console.warn(result.data.data);
         
            throw new Error(`Cannot initialize 'ABData': ` + result.message);
        }

        return result.data.deviceInfo;
    }

    processRequestBatch_Async(deviceInfo, requests)
    {
        js0.args(arguments, js0.RawObject, Array);

        return new Promise((resolve, reject) => {
            webABApi.json(this._apiUri + 'request', { 
                deviceInfo: deviceInfo,
                requests: requests 
                    }, (result) => {
                if (!result.isSuccess()) {
                    console.error(result.message);
                    console.log(result.data.data);
                    
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