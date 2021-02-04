'use strict';

const
    js0 = require('js0')
;

class Device
{

    static get Devices_Offset() {
        return 100000000;
    }


    static GetIdInfo(id)
    {
        js0.args(arguments, 'number');

        let deviceId = Math.floor(id / Device.Devices_Offset);

        return {
            id: id,
            deviceId: deviceId,
            itemId: id - deviceId * Device.Devices_Offset,
        };
    }


    get declaredItemIds() {
        return this._itemIds_Declared;
    }

    get hash() {
        return this._hash;
    }

    get id() {
        return this._id;
    }

    get lastItemId() {
        return this._lastItemId;
    }

    get lastUpdate() {
        return this._lastUpdate;
    }


    constructor(deviceId, deviceHash, lastUpdate, lastItemId, declaredItemIds = [])
    {
        js0.args(arguments, js0.Long, 'string', js0.Long, [ js0.Long, js0.Null ],
                [ Array, js0.Default() ]);

        this._id = deviceId;
        this._hash = deviceHash;
        this._lastItemId = lastItemId;
        this._lastUpdate = lastUpdate;

        this._itemIds_Declared = declaredItemIds;
    }

    isNewId(id)
    {
        js0.args(arguments, 'number');

        let idInfo = Device.GetIdInfo(id);

        if (this._isNewId_Device(idInfo))
            return true;

        // if (this._isNewId_SystemDevice(idInfo))
        //     return true;

        return false;
    }

    nextId()
    {
        let nextId = this._id * Device.Devices_Offset + (++this._lastItemId);
        this._itemIds_Declared.push(this._lastItemId);

        return nextId;
    }

    setDeclaredItemIds(declaredItemIds)
    {
        js0.args(arguments, Array);

        this._itemIds_Declared = declaredItemIds;
    }

    setLastUpdate(lastUpdate)
    {
        js0.args(arguments, js0.Long);

        this._lastUpdate = lastUpdate;
    }

    update(lastUpdate, lastItemId)
    {
        js0.args(arguments, js0.Long, js0.Long);

        this._lastUpdate = lastUpdate;
        this._lastItemId = lastItemId;
    }

    
    _isNewId_Device(idInfo)
    {
        if (idInfo['deviceId'] !== this._id)
            return false;

        if (idInfo['itemId'] <= this._itemIds_Last)
            return false;

        for (let itemId_Declared of this._itemIds_Declared) {
            if (idInfo['itemId'] === itemId_Declared)
                return true;
        }

        return false;
    }

}
module.exports = Device;