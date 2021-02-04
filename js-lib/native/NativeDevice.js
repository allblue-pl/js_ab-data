'use strict';

const
    js0 = require('js0')
;

class NativeDevice
{

    static get Devices_Offset() {
        return 100000000;
    }


    GetIdInfo(id)
    {
        js0.args(arguments, Number);

        let deviceId = Math.floor(id / NativeDevice.Devices_Offset);

        return {
            id: id,
            deviceId: deviceId,
            itemId: id - deviceId * NativeDevice.Devices_Offset,
        };
    }


    constructor()
    {
        
    }

    isNewId(id)
    {
        js0.args(arguments, Number);

        let idInfo = NativeDevice.GetIdInfo(id);

        if (this._isNewId_Device(idInfo))
            return true;

        // if (this._isNewId_SystemDevice(idInfo))
        //     return true;

        return false;
    }

}
module.exports = NativeDevice;