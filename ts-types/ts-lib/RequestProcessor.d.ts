import { type TS0RawObject } from "@allblue/ts0";
import DataScheme from "./DataScheme.ts";
import Device from "./Device.ts";
import Response from "./Response.ts";
import type { TRequestArgObject } from "./ABDRequestArgs.ts";
export default abstract class RequestProcessor {
    #private;
    get device(): Device | null;
    get scheme(): DataScheme;
    constructor(dataScheme: DataScheme, device: Device | null);
    processRequest_Async(request: RequestInfo_Parsed, transactionId?: number | null): Promise<Response>;
    processRequestBatch_Async(requests: Array<Request_Parsed>, transactionId?: number | null): Promise<Response>;
    abstract __processRequestBatch_Async(requests: Array<Request_Parsed>, transactionId: number | null): Promise<Response>;
}
export type Request = [
    requestId: string,
    requestInfo: RequestInfo
];
export type RequestInfo = [
    requestName: string,
    actionName: string,
    actionArgs: TRequestArgObject
];
export type Request_Parsed = [
    requestId: string,
    requestInfo: RequestInfo_Parsed
];
export type RequestInfo_Parsed = [
    requestName: string,
    actionName: string,
    actionArgs: TS0RawObject,
    schemeVersion: number
];
