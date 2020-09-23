'use strict';

const
    js0 = require('js0'),
    webABApi = require('web-ab-api'),

    abData = require('.'),
    DatabaseInfo = require('./DatabaseInfo'),
    NativeDatabase = require('./NativeDatabase'),
    RequestProcessor = require('./RequestProcessor')
;

class RequestProcessor_Native extends RequestProcessor
{

    constructor(dataScheme, apiUri, db)
    {
        js0.args(arguments, require('./scheme/DataScheme'), 'string',
                require('./native/Database'));
        super(dataScheme);

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

        let response = {};

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

        return success ? response : null;    
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

        console.log(rDBRequests);
        
        let result = await webABApi.json_Async(this._apiUri + 'sync-db', 
                { rDBRequests: rDBRequests });

        console.log(result);
        
        if (!result.isSuccess())
            console.warn(result.data.data);

        let response = result.data.response;

        if (!response.success)
            console.warn(response);

        let success = true;

        await this._db.transaction_Start_Async();

        for (let tableName in response.updateData.update) {
            let result = await this._scheme.getTable(tableName).update_Async(this._db,
                    response.updateData.update[tableName]);
            
            if (!result.success) {
                success = false;
                console.warn(result.error);
            }
        }

        for (let tableName in response.updateData.delete) {
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

        return {
            success: true,
            error: null,
        };
    }

    async updateDB_Async()
    {
        let dbInfo_Scheme = this._scheme.createDatabaseInfo();
        let dbInfo_DB = await this._db.createDatabaseInfo_Async();

        let queries = {
            create: [],
        };
        let actions = DatabaseInfo.Compare(dbInfo_Scheme, dbInfo_DB);

        for (let tableName of actions.tables.delete) {
            let query = `DROP TABLE ${tableName}`;
            
            console.log(query);
            console.log(await this._db.query_Execute_Async(query));
        }

        for (let tableName of actions.tables.create) {
            let tableInfo = dbInfo_Scheme.getTableInfo_ByName(tableName);
            let query = tableInfo.getQuery_Create();

            console.log(query);
            console.log(await this._db.query_Execute_Async(query));
        }
    }

}
module.exports = RequestProcessor_Native;