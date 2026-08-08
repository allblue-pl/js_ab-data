import ts0 from "@allblue/ts0"

class Device {
    static get Devices_Offset(): number {
        return 100000000;
    }


    static GetIdInfo(id: number): Device_IdInfo {
        let deviceId = Math.floor(id / Device.Devices_Offset);

        return {
            id: id,
            deviceId: deviceId,
            itemId: id - deviceId * Device.Devices_Offset,
        };
    }

    #hash: string;
    #id: number;
    #itemIds_Declared: Array<number>;
    #lastItemId: number;
    #lastUpdate: number;
    #locks: Array<number>;
    #locks_Next: number;


    get declaredItemIds(): Array<number> {
        return this.#itemIds_Declared;
    }

    get hash(): string {
        return this.#hash;
    }

    get id(): number {
        return this.#id;
    }

    get lastItemId(): number {
        return this.#lastItemId;
    }

    get lastUpdate(): number {
        return this.#lastUpdate;
    }


    constructor(deviceId: number, deviceHash: string, lastUpdate: number, 
            lastItemId: number, declaredItemIds: Array<number> = []) {
        this.#id = deviceId;
        this.#hash = deviceHash;
        this.#lastItemId = lastItemId;
        this.#lastUpdate = lastUpdate;

        this.#itemIds_Declared = declaredItemIds;

        this.#locks = [];
        this.#locks_Next = 0;
    }

    isNewId(id: number): boolean {
        let idInfo = Device.GetIdInfo(id);

        if (this.#isNewId_Device(idInfo))
            return true;

        // if (this.#isNewId_SystemDevice(idInfo))
        //     return true;

        return false;
    }

    lock(): void {
        this.#locks.push(this.#locks_Next++);
    }

    nextId(): number {
        let nextId = this.#id * Device.Devices_Offset + (++this.#lastItemId);
        this.#itemIds_Declared.push(this.#lastItemId);

        return nextId;
    }

    // setDeclaredItemIds(declaredItemIds)
    // {
    //     this.#itemIds_Declared = declaredItemIds;
    // }

    setLastUpdate(lastUpdate: number): void {
        this.#lastUpdate = lastUpdate;
    }

    unlock(lock: number): void {
        for (let i = 0; i < this.#locks.length; i++) {
            if (this.#locks[i] === lock) {
                this.#locks.splice(i, 1);
                return;
            }
        }

        throw new Error(`Lock '${lock}' does not exist.`);
    }

    update(lastUpdate: number, lastItemId: number): void {
        this.#lastUpdate = lastUpdate;
        this.#lastItemId = lastItemId;
    }

    
    #checkLock(): void {
        if (this.#locks.length > 0) 
            throw new Error('Device locked.');
    }

    #isNewId_Device(idInfo: Device_IdInfo): boolean {
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


type Device_IdInfo = {
    id: number,
    deviceId: number,
    itemId: number,
};