export declare class abUUID_Class {
    #private;
    constructor();
    generate(): string;
    getTime(uuid: string): number;
    validate(uuid: string): boolean;
}
declare const abUUID: abUUID_Class;
export default abUUID;
