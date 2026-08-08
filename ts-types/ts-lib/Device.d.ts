declare class Device {
    #private;
    static get Devices_Offset(): number;
    static GetIdInfo(id: number): Device_IdInfo;
    get declaredItemIds(): Array<number>;
    get hash(): string;
    get id(): number;
    get lastItemId(): number;
    get lastUpdate(): number;
    constructor(deviceId: number, deviceHash: string, lastUpdate: number, lastItemId: number, declaredItemIds?: Array<number>);
    isNewId(id: number): boolean;
    lock(): void;
    nextId(): number;
    setLastUpdate(lastUpdate: number): void;
    unlock(lock: number): void;
    update(lastUpdate: number, lastItemId: number): void;
}
export default Device;
type Device_IdInfo = {
    id: number;
    deviceId: number;
    itemId: number;
};
