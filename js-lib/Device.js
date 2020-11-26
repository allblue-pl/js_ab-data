'use strict';

const
    js0 = require('js0')
;

class Device
{

    static get Devices_Offset() {
        return 100000000;
    }


    get declaredItemIds() {
        return this._declaredItemIds;
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


    constructor(deviceId, deviceHash, lastUpdate, lastItemId)
    {
        js0.args(arguments, js0.Long, 'string', js0.Long, [ js0.Long, js0.Null ]);

        this._id = deviceId;
        this._hash = deviceHash;
        this._lastItemId = lastItemId;
        this._declaredItemIds = [];
        this._lastUpdate = lastUpdate;
    }

    nextId()
    {
        let nextId = this._id * Device.Devices_Offset + (++this._lastItemId);
        this._declaredItemIds.push(this._lastItemId);

        return nextId;
    }

    update(lastUpdate, lastItemId)
    {
        js0.args(arguments, js0.Long, js0.Long);

        this._lastUpdate = lastUpdate;
        this._lastItemId = lastItemId;
    }

}
module.exports = Device;