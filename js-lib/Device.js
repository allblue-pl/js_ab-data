'use strict';

const
    js0 = require('js0')
;

class Device
{

    get id() {
        return this._id;
    }

    get hash() {
        return this._hash;
    }

    get lastId() {
        return this._lastId;
    }

    get lastUpdate() {
        return this._lastUpdate;
    }


    constructor(deviceId, deviceHash, lastId, lastUpdate)
    {
        js0.args(arguments, js0.Long, 'string', js0.Long, [ js0.Long, js0.Null ]);

        this._id = deviceId;
        this._hash = deviceHash;
        this._lastId = null;
        this._lastUpdate = lastUpdate;

        this._nextId = lastId;
    }

    nextId()
    {
        return this._id * 100000000 + (++this._nextId);
    }

    update(lastId, lastUpdate)
    {
        this._lastId = lastId;
        this._lastUpdate = lastUpdate;
    }

}
module.exports = Device;