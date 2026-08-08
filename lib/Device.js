import ts0 from "@allblue/ts0"

class Device {
    static get Devices_Offset()         {
        return 100000000;
    }


    static GetIdInfo(id        )                {
        let deviceId = Math.floor(id / Device.Devices_Offset);

        return {
            id: id,
            deviceId: deviceId,
            itemId: id - deviceId * Device.Devices_Offset,
        };
    }

    #hash        ;
    #id        ;
    #itemIds_Declared               ;
    #lastItemId        ;
    #lastUpdate        ;
    #locks               ;
    #locks_Next        ;


    get declaredItemIds()                {
        return this.#itemIds_Declared;
    }

    get hash()         {
        return this.#hash;
    }

    get id()         {
        return this.#id;
    }

    get lastItemId()         {
        return this.#lastItemId;
    }

    get lastUpdate()         {
        return this.#lastUpdate;
    }


    constructor(deviceId        , deviceHash        , lastUpdate        , 
            lastItemId        , declaredItemIds                = []) {
        this.#id = deviceId;
        this.#hash = deviceHash;
        this.#lastItemId = lastItemId;
        this.#lastUpdate = lastUpdate;

        this.#itemIds_Declared = declaredItemIds;

        this.#locks = [];
        this.#locks_Next = 0;
    }

    isNewId(id        )          {
        let idInfo = Device.GetIdInfo(id);

        if (this.#isNewId_Device(idInfo))
            return true;

        // if (this.#isNewId_SystemDevice(idInfo))
        //     return true;

        return false;
    }

    lock()       {
        this.#locks.push(this.#locks_Next++);
    }

    nextId()         {
        let nextId = this.#id * Device.Devices_Offset + (++this.#lastItemId);
        this.#itemIds_Declared.push(this.#lastItemId);

        return nextId;
    }

    // setDeclaredItemIds(declaredItemIds)
    // {
    //     this.#itemIds_Declared = declaredItemIds;
    // }

    setLastUpdate(lastUpdate        )       {
        this.#lastUpdate = lastUpdate;
    }

    unlock(lock        )       {
        for (let i = 0; i < this.#locks.length; i++) {
            if (this.#locks[i] === lock) {
                this.#locks.splice(i, 1);
                return;
            }
        }

        throw new Error(`Lock '${lock}' does not exist.`);
    }

    update(lastUpdate        , lastItemId        )       {
        this.#lastUpdate = lastUpdate;
        this.#lastItemId = lastItemId;
    }

    
    #checkLock()       {
        if (this.#locks.length > 0) 
            throw new Error('Device locked.');
    }

    #isNewId_Device(idInfo               )          {
        if (idInfo['deviceId'] !== this.#id)
            return false;

        if (idInfo['itemId'] <= this.#lastItemId)
            return false;

        if (this.#itemIds_Declared.includes(idInfo['itemId']))
            return true;

        return false;
    }

}
export default Device;


                      
               
                     
                   
  