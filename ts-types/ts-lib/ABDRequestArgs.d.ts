import { type TS0RawObject } from "@allblue/ts0";
export default class ABDRequestArgs {
    #private;
    static ParseArgs(args: TRequestArgObject): TS0RawObject;
    get argPath(): string;
    constructor(argPath: string);
}
export declare class ABDRequestResult {
    #private;
    get resultPath(): string;
    constructor(argPath: string);
}
export declare function abdRequestResult(argPath: string): ABDRequestResult;
export type TRequestArgArray = Array<TRequestArgValue>;
export type TRequestArgObject = {
    [key: string | number]: TRequestArgValue;
};
export type TRequestArgValue = boolean | null | number | string | TRequestArgArray | TRequestArgObject | ABDRequestResult;
