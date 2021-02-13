'use strict';

const
    abData = require('ab-data'),
    js0 = require('js0'),

    DataStore = require('../DataStore')
;

class NativeDataStore extends DataStore
{

    static async ClearData_Async(scheme, db, device)
    {
        js0.args(arguments, abData.scheme.DataScheme, abData.native.Database);

        let localTransaction = false;
        if (db.transaction_IsAutocommit()) {
            localTransaction = true;
            await db.transaction_Start_Async();
        }

        if (device !== null) {
            device.setLastUpdate(null);
            await NativeDataStore.UpdateDeviceInfo_Async(scheme, db, device);
        }

        await scheme.getT('_ABData_DBRequests').delete_Async(
                db, {});

        if (localTransaction)
            await db.transaction_Finish_Async(true);
    }

    static async GetDeviceInfo_Async(scheme, db)
    {
        js0.args(arguments, abData.scheme.DataScheme, abData.native.Database);

        let tSettings = scheme.getTable('_ABData_Settings');
        let rDeviceInfo = (await tSettings.row_Async(db, { where: [ 'Name', '=', 'deviceInfo' ] }))

        return rDeviceInfo === null ? null : rDeviceInfo.Data;
    }

    static async SetDeviceInfo_Async(scheme, db, deviceId, deviceHash, lastItemId, lastUpdate,
            declaredItemIds)
    {
        js0.args(arguments, abData.scheme.DataScheme, abData.native.Database,
                js0.Long, 'string', js0.Long, [ js0.Long, js0.Null ], Array);

        let tSettings = scheme.getTable('_ABData_Settings');
        await tSettings.update_Async(db, [
            {
                Name: 'deviceInfo',
                Data: {
                    deviceId: deviceId,
                    deviceHash: deviceHash,
                    lastItemId: lastItemId,
                    lastUpdate: lastUpdate,
                    declaredItemIds: declaredItemIds,
                },
            },
        ]);
    }

    static async InitDeviceInfo_Async(scheme, db)
    {
        js0.args(arguments, abData.scheme.DataScheme, abData.native.Database);

        let tSettings = scheme.getTable('_ABData_Settings');
        let rDeviceInfo = (await tSettings.row_Async(db, { where: [ 'Name', '=', 'deviceInfo' ] }));
        if (rDeviceInfo === null)
            return null;

        rDeviceInfo.Data.declaredItemIds = [];
        rDeviceInfo.Data.usedItemIds = [];
        
        return rDeviceInfo === null ? null : rDeviceInfo.Data;
    }

    static async UpdateDeviceInfo_Async(scheme, db, device)
    {
        js0.args(arguments);

        let localTransaction = false;
        if (db.transaction_IsAutocommit()) {
            localTransaction = true;
            await db.transaction_Start_Async();
        }

        let lastDeclaredItemId = device.lastItemId;
        // for (let itemId_Declared of this.device.declaredItemIds) {
        //     if (itemId_Declared > lastDeclaredItemId)
        //         lastDeclaredItemId = itemId_Declared;
        // }

        let deviceInfo = await NativeDataStore.GetDeviceInfo_Async(scheme, db);
        let declaredItemIds = deviceInfo.declaredItemIds;
        for (let itemId of device.declaredItemIds) {
            if (!declaredItemIds.includes(itemId))
                declaredItemIds.push(itemId);
        }

        await NativeDataStore.SetDeviceInfo_Async(scheme, db, 
                device.id, device.hash, lastDeclaredItemId, 
                device.lastUpdate, declaredItemIds);

        if (localTransaction)
            await db.transaction_Finish_Async(true);
    }


    constructor(requestProcessor)
    {
        js0.args(arguments, require('../RequestProcessor_Native'));

        super(requestProcessor);
    }

}
module.exports = NativeDataStore;